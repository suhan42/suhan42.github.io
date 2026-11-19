---
title: Typora 授权与激活机制分析
date: 2026-11-18
slug: typora-license-analysis
category: it
subcategory: markdown
tags:
  - markdown
  - security
summary: 分析 Typora 免费激活方案的凭证签发、机器绑定和校验机制。
status: published
---

# Typora免费激活的背后原理

用过 Markdown 的人，让他说一个最爱用的相关软件，基本都是 Typora。但从 2021 年 1.0 正式版开始收费之后催生了大量「永久免费版下载」「2026 最新激活工具」「无限重置试用期」之类的资源：改 hosts、断网激活、注册机轮番上阵，背后是一门实打实的 SEO 流量生意。这些工具真的能「永久激活」吗？实际上，绝大多数只做了两件事——要么改掉渲染层的一个布尔标志让 UI 显示「已激活」，要么重置注册表里的安装日期骗过 14 天试用倒计时，主进程的验签逻辑一行都没碰。

而 Typora 的真实防护远比这复杂：它把整个主进程编译成 379KB 的 V8 字节码（不是普通 JavaScript，是给 V8 引擎执行的中间表示），塞进 `app.asar` 归档里，用自研 loader 加载；激活凭据走 `publicDecrypt` + SHA-256 非对称签名，服务端私钥签发、客户端内置公钥验签；机器绑定拼的是 `uuid + username + hostname + platform`；注册表 `HKCU\Software\Typora` 里存的 `SLicense` 只是缓存快照，真正的决策在 12 小时一次的续期请求和服务器端。

这篇文章就从「为什么全网都在搜 Typora 激活」这个现象入手，把收费模式、用户心理、流传破解的真实原理、V8 字节码和 Electron 架构背后的加密体系逐层拆开。

# 一、核心设计决策

Typora 的方案是「离线凭证 + 在线签名 + 周期续期」，这是商业桌面软件最常用的三层结构。以下每一条结论都标注了对应的实测证据（字节码偏移量、注册表键名、运行时日志），证据来自对 Typora 1.12.4（`app.asar` 381KB）的字符串池扫描和本机运行时观察。逐层拆开：

### 1. 凭证签发：非对称签名，不是对称加密

Typora 用的是 `publicDecrypt` + SHA-256，说明服务端用**私钥签名**，客户端用内置**公钥验签**。实测证据：`.jsc` 字符串池偏移 85996 处找到 `publicDecrypt` 字面量，偏移 85625 处找到 `sha256` 字面量，紧挨着的还有 `createHash`、`update`、`readFile`、`digest` 这些 Node crypto API 的字符串。这是行业标准做法，原因：

- 客户端只需要公钥，公钥泄露不影响安全性（私钥永远在服务器）
- 对称加密的话，客户端和服务器共享同一个密钥，客户端被逆向一次整个体系就崩了
- 算法推荐 Ed25519（签名短、验签快）或 RSA-2048/3072（生态最成熟）。Node.js 的 `crypto.sign` / `crypto.verify` 原生支持，不需要第三方库

### 2. 凭证内容：不是「是/否」，而是一段结构化数据

签名包裹的 payload 里应该放：

```json
{
  "email": "user@example.com",
  "license_key": "ABCDE-FGHIJ-KLMNO-PQRST",
  "machine_id": "uuid+硬件指纹哈希",
  "issued_at": 1728900000,
  "expires_at": 1760436000,
  "seats": 3,
  "features": ["export-pdf", "sync"]
}
```

这样客户端验签后能本地判断「这个凭证有没有过期」「是不是这台机器」「有没有某功能权限」，不需要每次启动都联网。

### 3. 机器绑定：防一个序列号到处用

Typora 拼的是 `uuid + username + hostname + platform`。实测证据：`.jsc` 字符串池偏移 111597 处有 `username`，偏移 111626 处有 `COMPUTERNAME`，偏移 111650 处有拼接符 `" | "`，偏移 112022 处有 `"hostname~ "`，偏移 111998 处有 `" | darwin"`（对应 macOS 分支），偏移 111666 处有 `" | Windows"`（对应 Windows 分支）。另外偏移 83310 处有 `native-reg`、偏移 83334 处有 `Software\Typora`，说明 Windows 下是通过原生模块读写注册表。这个粒度偏弱（UUID 存在 `profile.data`，删了就变），但桌面软件一般也不需要太强。常见做法分几档：

- 弱：`uuid + hostname`（重装系统就变，用户体验好）
- 中：`主板序列号 + CPU ID` 哈希（换硬件才变）
- 强：TPM / 硬件密钥（太麻烦，商业软件很少用）

配合服务端的 `seats` 数量限制（「最多激活 3 台设备，超出自动踢最早那台」——Typora 的错误信息里有这个逻辑）。

### 4. 试用期：本地记安装日期，但要有锚点

Typora 用注册表 `IDate` + `profile.data` 的 birthtime 双份存储。实测证据：本机注册表 `HKCU\Software\Typora` 里有两个值——`IDate = "10/14/2026"`（字符串类型）和 `SLicense = ""`（字符串类型，空值代表未激活）。运行时日志 `typora.log` 里每次启动都有这些行：

```
[WindowsLicenseLocalStore] SLicense : 
onUnfillLicense
[WindowsLicenseLocalStore] IDate : 10/14/2026
trailRemains is 14
[L] installDate is 10/14/2026, trail remains: 14 days
```

对应的字节码字符串池偏移：`WindowsLicenseLocalStore` 在 83568，`trailRemains is ` 在 103897，`[L] installDate is ` 在 103991。这是「不联网也能试用」的代价：本地日期可以被改，把注册表里的 `IDate` 改成明天的日期，trial 就重置了——所以需要服务器锚点兜底。

### 5. 续期 / 心跳：控制失效速度

Typora 是 12 小时续期一次。实测证据：`.jsc` 字符串池偏移 100171 处有 `"[renewLicense] license renewed in 12h"`，偏移 100356 处有 `"[renewLicense]: "`（日志前缀），偏移 100919 处有 `"[renewL]: unfill due to renew fail"`（续期失败降级的日志前缀）。这个周期是个权衡：

- 间隔短 → 盗版/失效凭证能很快被切掉，但对断网用户不友好
- 间隔长 → 离线容忍度高，但作弊窗口也长

常见值是 24h～7d，配合「连续 N 次续期失败才降级到未激活」，避免临时断网把付费用户踢出去。

### 6. 防篡改的现实

Typora 把主进程编译成 V8 字节码（`atom.compiled.dist.jsc`，379KB，webpack 打包后整体编译）。关于 asar 完整性校验，实测结论和直觉相反：用 `@electron/fuses` 工具读取 `Typora.exe` 的 Electron Fuse 配置，`EnableEmbeddedAsarIntegrityValidation` 是 **Disabled**，说明 Typora 没有启用 Electron 原生的 asar 内嵌哈希校验。这是「提高门槛」而不是「绝对防护」——字节码可以被针对特定 V8 版本的反编译器还原，Electron Fuse 里没开的防御就等于不存在。真正让破解不划算的往往不是代码混淆，而是**把关键判断放在服务端**（比如导出 PDF、云同步这类必须联网的功能，服务端验证了凭证才响应）。

---

# 二、流传的破解

> 有的人说：Typora 是 Electron 应用，激活验证逻辑写在前端 JS 文件里。它在`Typora\resources\page-dist\static\js`的`LicenseIndex.*.js`文件有一行代码`hasActivated="true"==e.hasActivated`，这行代码会去检查你的激活状态。脚本做的事情就是把 `e.hasActivated` 改成 `"true"`，让这个判断永远返回 true，变成 `hasActivated="true"=="true"`。

这个机制就是「URL 参数 → 布尔值 → UI 状态」这条链路，但这里有几个细节值得拆开说清楚，因为它们决定了「改 URL 参数能不能真正破解」这个问题。

## 1. `hasActivated="true"==e.hasActivated` 在做什么

这一行确实在 Typora 安装目录 `resources\page-dist\static\js\LicenseIndex.180dd4c7.5789633d.js` 里，具体位置是 `T` 函数（以下代码摘自该文件）：

```js
T=function(){
  var e={};
  return window.location.search.substr(1).split("&").forEach(function(t){
    e[t.split("=")[0]]=t.split("=")[1]
  }),
  e.hasActivated="true"==e.hasActivated,   // 这一行
  e.index=isNaN(e.index-0)?0:e.index-0,
  e.needLicense="false"!=e.needLicense,
  e.dayRemains=e.dayRemains-0,
  e
}()
```

它做的事：解析 `license.html?ecp=...&hasActivated=...&dayRemains=...` 这串 URL 查询字符串，把字符串转成布尔值。`"true"==e.hasActivated` 是 JS 里一种防御性写法：URL 传过来的永远是字符串，写 `"true"==x` 比直接 `Boolean(x)` 更严格，能挡住 `hasActivated=1` 或 `hasActivated=yes` 这类误传。

这里要先分清两个容易混的字段名，它们属于不同的链路：

- **`hasActivated`**：URL 查询参数。主进程打开 `license.html` 时通过 `loadURL` 把当前激活状态作为 URL 参数传进来，渲染端的 `T` 函数解析它。这条链路只影响许可面板这个窗口的 UI。
- **`hasLicense`**：渲染进程里的运行时变量，位于 `window.File.option.hasLicense`。主进程通过一段内嵌 JS 注入到主窗口的页面里（见本文第三章「内嵌 JavaScript 注入片段」），用来控制主窗口的「UNREGISTERED」水印显示。这条链路影响主编辑器窗口的 UI。

两条链路都是「主进程 → 渲染端」单向传递的**展示层数据**，不参与真正的验证决策。

### 这一行是「显示」还是「验证」

关键区别在这里。`hasActivated` 决定的是许可面板 UI 显示「已激活」还是「未激活」，`hasLicense` 决定主窗口是否显示「UNREGISTERED」水印，两者本身都**不是**验证逻辑，是验证**结果的展示层**。真实的验证发生在主进程：

1. 主进程（V8 字节码里的许可模块）做公钥验签 + 设备绑定 + 过期检查
2. `evaluateCurrentState` 把结果返回给 `getState`
3. `startRenewalLoop` 每 12 小时找服务器续期
4. 状态通过 IPC 传给渲染端（许可面板走 URL 参数，主编辑器窗口走 `File.option.hasLicense` 注入）
5. 渲染端把这个结果渲染成 `Typora Activated` / `Activate Typora` 按钮文案，或者显示 / 隐藏水印

所以攻击者如果只改 `hasActivated="true"==e.hasActivated` 这一行，让许可面板显示「已激活」，但主进程的验证逻辑（V8 字节码里）每次刷新状态时依然走真实的验签流程，结果还是「未激活」，主编辑器窗口的水印也不会消失——因为水印走的是 `File.option.hasLicense` 那条注入链路，和许可面板的 URL 参数是两条独立的线。真实功能还是受限。

### Typora 的情况更极端一点

Typora 的主进程是 V8 字节码（`atom.compiled.dist.jsc`），不是明文 JS。攻击者要改主进程的验证逻辑，得先把 `.jsc` 反编译回可读代码，改完再重新编译成 `.jsc` 塞回去。比改明文 JS 麻烦得多，但不是不可能。

但 Typora 的 `LicenseIndex.js` 是明文。所以对 Typora 的一种攻击路径是：**不改主进程，只改渲染端**，把 `hasActivated` 参数硬编码成 `true`，让 UI 显示已激活，然后通过 `Setting.invokeWithCallback` 走主进程的 `addLicense` IPC 时绕过实际服务器请求——但这条路径依然需要主进程配合返回成功，而主进程的验证逻辑在字节码里，不容易改。

### 一个容易混的点

把 e.hasActivated 改成 "true" 有两种理解方式：

- **改 URL 生成逻辑**：主进程打开 `license.html?hasActivated=false` 时不改，而是在主进程侧 `loadURL` 之前把参数改成 `hasActivated=true`。这是攻击点在主进程。
- **改渲染端解析逻辑**：让渲染端无论 URL 里传什么，都把 `hasActivated` 判定为 `true`。这是上面那种改法，攻击点在渲染端。

这两种改法都能让 UI 显示已激活，但都不改变主进程的真实验证结果。完整破解必须同时改主进程的 `verifyCredential`，或者让主进程的 `getState` 直接返回 `activated:true`。



> 在 license.html 里注入一行 window.close()，把激活弹窗直接关掉，但是主进程在每次打开文件、保存文件时还是会走 license:state → verifyCredential → 返回 false，真实功能还是受限。

这正是「UI 层 ≠ 业务逻辑层」的教科书例子。

## 2. `window.close()` 注入能做什么

`license.html` 是渲染进程加载的 HTML。在里面加一行 `window.close()`（比如塞到 `<script>` 标签开头），效果是：

- 页面加载后立即尝试关闭这个窗口
- 用户看到的效果就是「激活弹窗闪一下就消失」，或者根本没弹出来
- UI 上看起来「激活检查被绕过了」

但它只是关掉了那个窗口。这个窗口的所有职责——显示激活状态、收集邮箱和许可证、调用 `Setting.invokeWithCallback("addLicense", ...)`——都随着窗口关闭而消失，但**没有替代它们**。

### 为什么真实功能还是受限

主进程这边没有任何变化：

1. `verifyCredential` 还是那套 RSA 验签 + 设备绑定 + 过期检查
2. `startRenewalLoop` 还是每 12 小时找服务器续期
3. 渲染端每次调用 `window.editorAPI.licenseState()`，主进程都返回真实的 `activated: false`
4. 如果应用在文件打开/保存时再查一次 `license.getState()`，还是会拿到 `false`

所以攻击者关掉 UI 只是让「未激活」这个提示不再显示，应用该受限还是受限。这和前面说的「改 `hasActivated` 参数让 UI 显示已激活」是同一类攻击——都是**改变显示层**，不改变**决策层**。

### 这个分离为什么重要

在架构上，这是一个基本原则：**安全决策必须放在不能被 UI 层欺骗的位置**。项目把 `verifyCredential` 放在主进程，渲染进程只能通过 IPC 问主进程「状态是什么」，不能自己决定「状态是什么」。就算渲染进程被完全替换成空文件，主进程的判断不受影响。

Typora 做得更进一步：主进程是 V8 字节码，所以连主进程的判断逻辑都不容易被改。这是「UI 层（明文 JS）→ 主进程层（字节码）→ 服务器层（私钥）」的三级防御，每一层都要求攻击者付出不同的成本。

### 一个容易忽略的细节

`window.close()` 在 Electron 里有个限制：默认只有脚本自己打开的窗口才能被脚本关闭。如果激活弹窗是主进程用 `BrowserWindow` 创建的独立窗口，渲染进程里调 `window.close()` 能不能关掉，取决于主进程有没有给它 ` closable` 权限或者是不是同一个 window 对象。不过这是 Electron 的安全细节，不影响上面那个「关掉 UI 不影响真实功能」的结论。



## 3. 攻击者如何整个跳过、把验签结果硬编码成 true（没有asar打包）

对打包产物里的 `resources\app\src\license\license.js` 做了两处改动：

1. **`verifyCredential` 硬编码返回 true**：函数开头直接 `return { valid: true, payload: {...} }`，伪造了一年有效期的凭据，后面真实的 RSA 验签、设备绑定、过期检查永远不执行。这一改动让 `requireActivation()` 每次都返回 `allowed: true`，闸门失效。
2. **`startRenewalLoop` 变成空操作**：函数开头 `return`，12 小时定时器不启动，客户端永远不会向服务器发起续期请求。伪造的本地凭据不会被真实凭据覆盖，也不会被服务器撤销。

两个改动配合起来：闸门被打开 + 定期刷新被切断 = 永久激活。

### 为什么这么容易

打包产物里 `resources\app\` 是明文 JS 目录，用记事本就能改。就算加了 `--asar` 打包，`npx asar extract` 一条命令也能解开。改完保存，直接重启 exe 就生效，Electron 运行时会加载被篡改的 JS。

### 防御思路

既然攻击点集中在「明文 JS 被替换」，对应的防御方向就是把明文 JS 变成不容易被改的东西。业界常用做法是：

- **`bytenode`** 把 `license.js` 编译成 V8 字节码 `.jsc`，用记事本就改不动了。攻击者要反编译才能理解逻辑，改完还要能重新编译回 `.jsc` 才能替换。攻击成本从 30 秒变成几小时到几天。
- **asar 打包 + 完整性校验**：主进程启动时读取 `app.asar` 的哈希，和自己内嵌的期望值对比，不匹配就退出。攻击者就算改了 asar，校验也会失败（除非攻击者也改掉校验逻辑，这就回到「改主进程字节码」的老问题）。
- **多处校验**：把 `requireActivation` 分别在主进程、渲染进程、文件读写的关键路径上都调一次，攻击者要找到并修改所有校验点。



## 4. Typora 的结构

Typora 的结构里，上面改的 `resources\app\src\license\license.js` 那条攻击路径，在 Typora 里对应的是 `resources\app.asar\atom.compiled.dist.jsc`——同一个位置，但保护方式升级了。

### 结构对照

| 位置              | 示例项目                                            | Typora                                                   |
| ----------------- | --------------------------------------------------- | -------------------------------------------------------- |
| 客户端逻辑入口    | `resources\app\src\main.js`（明文）                 | `resources\app.asar`（打包）                             |
| 核心业务/验证逻辑 | `resources\app\src\license\license.js`（明文）      | `resources\app.asar\atom.compiled.dist.jsc`（V8 字节码） |
| 渲染端 UI         | `resources\app\renderer\renderer.js`（明文）        | `resources\page-dist\static\js\LicenseIndex.js`（明文）  |
| 本地状态          | `%APPDATA%\my-markdown-editor\license\license.json` | `HKCU\Software\Typora`（注册表）                         |
| 服务器通信        | `api/client/activate / renew / deactivate`          | `api/client/activate / renew / deactivate`（相同）       |

### 为什么 Typora 的门槛更高

Typora：攻击者要先 `asar extract app.asar`，拿到一个 379KB 的 `atom.compiled.dist.jsc` 文件。这不是 JS，是 V8 字节码——是 Node/V8 把源码编译成字节码后序列化的结果。用记事本打开会看到一堆二进制。要读懂它，攻击者得：

1. 用 `view-source:0` 或专门工具（比如 `view8`）把字节码反编译回类 JS 源码
2. 理解验证逻辑在哪个函数
3. 修改后重新用 `bytenode` 编译成 `.jsc`
4. 把新的 `.jsc` 塞回 asar
5. 处理 asar 内部文件的哈希校验（如果 Typora 内部校验了哈希）

### 但这不是绝对安全

V8 字节码能被反编译。工具链已经存在（`view8`、`jsc2js` 等），Typora 的主进程字节码我们前面做字符串扫描时，直接从里面扫出了 `[renewLicense] license renewed in 12h`、`WindowsLicenseLocalStore`、`api/client/activate` 这些明文字符串——说明字符串常量根本没加密。也就是说，攻击者不用完整反编译，光靠字符串常量就能猜出大概结构，再定点反编译关键函数就行。

所以 Typora 的保护是「显著提高攻击成本」，不是「无法破解」。真正难绕过的部分是**服务器端**：续期接口认机器码 + 签名凭据，攻击者本地改得再欢，服务器不认就没辙。所以破解者常见的最后一步是「把续期请求整个跳过」——就是前面提到的那个方向。

### 展示层 `LicenseIndex.js` 是明文

我们扫描 Typora 字节码时发现的另一个线索：`page-dist/static/js/LicenseIndex.js` 是明文，而且它负责「显示」激活状态。这意味着 Typora 的分层其实是：

1. 主进程字节码（决策层，难改）
2. 渲染端明文（展示层，易改）
3. 服务器（信任锚，改不了）

攻击者最容易得手的就是展示层，但展示层改了也不影响决策层，这就是为什么 UI 层攻击在 Typora 上不构成完整破解。

**所以，这也是网上流传的所谓“破解”方法简单但是不彻底的原因。**

---



# 三、尝试破解 app.asar

1. **`atom.compiled.dist.jsc` 是 V8 字节码，不是源码。**

V8 字节码不是设计来反编译回源码的，它是给 V8 引擎执行的中间表示。字节码反编译是「启发式 + 大量猜测」，还原出来的不是原代码，是等价或近似等价的伪代码。可以想象成把编译后的 `.exe` 反编译回 C 语言的难度——能做到，但还原出来的东西和原代码在细节上偏差很大。

V8 字节码依赖引擎版本和运行时环境。Typora 用的是 Electron 内嵌的 Node.js 版本，字节码只有在匹配的 V8 版本下才能反编译/重编译。版本不匹配，反编译工具直接拒绝或输出乱码。前面扫字符串时看到大量 ASN.1/RSA 错误字符串，这些常量确实能读，但**控制流**（if/else 分支、函数边界、调用图）在字节码层面已经被打散，不是读常量就能还原的。

2. **修改后要重编译成 `.jsc`，需要 `bytenode` 或类似工具，而 `bytenode` 编译时要求源码是完整的、可运行的 JS 源码。**

反编译出来的「近似源码」，它可能缺 import 声明、缺内嵌公钥、缺闭包引用。直接用近似源码编译出来的 `.jsc` 和原始 `.jsc` 的行为不一样，Typora 可能直接崩溃。要修补这些差异，需要非常熟悉 Typora 的内部实现，做这件事本质上是在逆向重建 Typora，工作量是「重新实现一个 Typora code」级别的。

3. **「`app.asar` 内部文件哈希」这层防御实际不存在。**

这里要修正一个之前的误判。用 `@electron/fuses` 实测 `Typora.exe`，`EnableEmbeddedAsarIntegrityValidation` 是 **Disabled**——Typora 没有启用 Electron 原生的 asar 内嵌哈希校验。asar 格式本身确实在每个文件的元数据里带了 `integrity` 字段（`algorithm` / `hash` / `blocks`，见 `@electron/asar` 文档），但这只是格式预留，要真正生效需要主进程（或 Electron 运行时）主动校验，Typora 没开这个 fuse。也就是说，Typora 的「asar 改了会被发现」这层防御**实际上不存在**，攻击者改完 asar 打包回去，应用不会拒绝启动。

那「自举困境」呢？它依然是 Electron 应用做完整性校验时绕不开的问题，只是 Typora 没有走到这一步。如果 Typora 开了 `EnableEmbeddedAsarIntegrityValidation`，校验逻辑就在 Electron 二进制里（操作系统层面），而不是 asar 里的 JavaScript，那才是真正的「校验方在被校验对象之外」。Typora 依赖的是其他防线：主进程 V8 字节码、服务器端验证、以及（从 fuse 列表推断）`OnlyLoadAppFromAsar: Enabled` 这种限制加载来源的设置。

### Electron Fuse 逆向实测数据

用 `npx @electron/fuses read --app "D:\Software\Typora\Typora.exe"` 读出的完整 fuse 配置：

```
RunAsNode: Disabled                              ← 堵死 ELECTRON_RUN_AS_NODE 环境变量攻击
EnableCookieEncryption: Disabled
EnableNodeOptionsEnvironmentVariable: Enabled    ← NODE_OPTIONS 注入路径还开着
EnableNodeCliInspectArguments: Disabled          ← 堵死 --inspect 调试攻击
EnableEmbeddedAsarIntegrityValidation: Disabled  ← asar 哈希校验没开
OnlyLoadAppFromAsar: Enabled                     ← 只允许从 asar 加载应用
LoadBrowserProcessSpecificV8Snapshot: Disabled
GrantFileProtocolExtraPrivileges: Enabled
```

这组数据说明：Typora 精准关掉了「让 Electron 退化成 Node」和「让攻击者附加调试器」这两条路（对应本文第四章的环境变量和运行时 Hook 两类），但**没开** asar 完整性校验，也**没关** `NODE_OPTIONS` 注入。这和本文第四章的结论一致——每一层防线都有明确的取舍，没有「全开」的商业软件。

## 附：Electron 应用逆向实验

完整链路：打包 → 反编译 → 修改 → 重编译 → 完整性校验 → 绕过

### 第一步：反编译 V8 字节码

**做什么**

1. 先把自己的 `license.js` 编译成 `.jsc`（用项目里现成的 `npm run compile:license`）。
2. 用工具反编译回来：
   - `view8`（GitHub 上的开源工具，能把 `.jsc` 反汇编成可读的伪代码）
   - `view-source:0`（Chrome DevTools 的 trick，某些场景能看到字符串池）
   - 直接 `strings` / 十六进制编辑器翻字符串常量

**会看到什么**

| 保留的                                                       | 丢失的                             |
| ------------------------------------------------------------ | ---------------------------------- |
| 所有字符串常量（明文，包括中文提示、API 路径、公钥内容）     | 变量名、函数参数名                 |
| 控制流骨架（条件判断、循环、函数边界）                       | 全部注释                           |
| 导出符号表（`activateLicense`、`requireActivation` 这些名字还在） | 原始代码格式和空行                 |
| 常量表（数字、正则、模板字符串）                             | 部分 V8 优化时合并或裁掉的分支细节 |

**关键认知**

`.jsc` 不是加密，是「编译」。防护等级等同于把源码读起来更费劲，不等于读不了。一个熟悉 V8 字节码结构的人，花半天就能看懂激活逻辑在干什么、哪个分支是拦截入口。

### 第二步：修改后重编译

**做什么**

1. 从反编译产物里挑一个目标改掉（最简单：把 `"请先激活后再使用保存功能"` 改成 `"已授权"`，或者把 `requireActivation` 里那个 `if (state.activated)` 的判断条件反转）。
2. 用与目标 Electron 版本**完全一致**的 V8 重新编译成 `.jsc`。
3. 替换回去，跑应用，看行为是否变化。

**会碰到的真实问题**

1. **V8 版本强绑定**：`.jsc` 文件头里记录了生成它的 V8 版本哈希、flag hash、只读快照校验和。目标应用用 Electron 44（V8 14.8+），就必须用 Electron 44 的 V8 编译。差一个版本，加载时直接 `cachedDataRejected` 或者进程崩溃（不是优雅报错，是 SIGTRAP 级别的硬崩）。
   - 实操：从应用的 `node_modules/electron/dist/electron.exe` 直接拿来当编译器，用 `ELECTRON_RUN_AS_NODE=1` 去跑 bytenode 的编译流程。
   - 注意 Electron 44+ 还有更细的坑：`ELECTRON_RUN_AS_NODE` 编译出来的字节码和 Electron 主进程里编译出来的**只读快照校验和不一样**，加载时也会崩。必须让编译脚本本身跑在 Electron 主进程里（不带 `ELECTRON_RUN_AS_NODE`），这也是我们项目里 `compile-license.js` 专门做的事。
2. **闭包和模块包装**：`.jsc` 是对 `Module.wrap()` 之后整个模块代码的字节码快照，不是单个函数的快照。改反编译产物时，改动必须在同一个模块作用域内自洽——不能凭空引用一个外部不存在的变量，否则运行时 `ReferenceError`。
3. **序列化格式不是文档化的稳定格式**：`.jsc` 的二进制布局是 V8 内部序列化格式的快照，没有公开文档承诺向后兼容。V8 小版本升级都可能改变布局，这也是为什么 bytenode 某些版本要手动 patch 文件头（改 flag hash 那几个字节）。

**省事路径（攻击者视角）**

比逆向 `.jsc` 快十倍的做法：直接改 asar 里明文的 `main.js`，把 `require("./license/license.jsc")` 改成 `require("./license/license")`，塞一个假的 `license.js` 进去，永远返回 `{ allowed: true }`。这不需要碰字节码，三分钟搞定。

### 第三步：asar 哈希自举问题

**做什么**

1. 在 `main.js` 开头加一段「启动时读 `app.asar` 自身，算 SHA-256，和硬编码的期望值比对，不一致就 `app.exit(1)`」。
2. 重新打包，拿到新 asar 的哈希，写回校验代码里，再打包一次。
3. 解包 asar，改一个文件，重新打包，跑起来看哈希校验怎么拦截。

**会看到**

校验生效了，篡改后的 asar 无法通过启动检查，应用拒绝运行。看起来防住了。

**然后再想一步**

那段校验代码**也在这个 asar 里，而且是明文 JavaScript**。攻击者解包 asar，看到校验逻辑，做两件事中的任何一件：

- 把哈希比对那行改成 `if (false) app.exit(1)`；
- 直接删掉整段校验代码。

重新打包，校验就没了。**校验逻辑和被校验的数据住在同一个可写文件里，这个校验就是装饰品。**

这就是「自举困境」：你不能用被保护的东西自己去保护自己。

### 结论：真正拦得住的是什么

只有一种东西能拦住这条链路：**签名验证发生在你能修改的范围之外**。

| 防线                                             | 拦谁                             | 放过谁                                 |
| ------------------------------------------------ | -------------------------------- | -------------------------------------- |
| `.jsc` 字节码                                    | 脚本小子（不熟悉 V8 结构的人）   | 懂逆向的人（半天看懂）                 |
| asar 归档                                        | 随手翻目录的人                   | 会用 `npx asar extract` 的人           |
| asar 内哈希校验                                  | 不改代码的人                     | 会删校验代码的人                       |
| Electron 代码签名（Authenticode / notarization） | 改了 asar 但没有你的私钥的人     | 有用户证书信任链的人（极少）           |
| 服务器端校验（关键判断放远端）                   | 所有本地篡改，因为判断不在客户端 | 能伪造网络响应的人（需要额外做中间人） |


------

## Typora 1.12.4 实测（`app.asar` 381KB）

### 架构

|                 | Typora                                                       |
| --------------- | ------------------------------------------------------------ |
| `.jsc` 生成工具 | 自研 loader `launch.dist.js`（内嵌，无 bytenode 依赖）       |
| `.jsc` 数量     | 1 个（atom.compiled.dist.jsc，379KB，webpack 打包后整体编译） |
| webpack 打包    | 有（`__webpack_modules__` / `__webpack_require__` 在字符串池里） |
| 源码规模        | 约 23 万字节的字节码 / 数百个 webpack 模块                   |
| 许可状态存储    | **Windows 注册表** `HKCU\Software\Typora`（`IDate` + `SLicense`） |
| 试算逻辑        | 注册表 `IDate` + 14 天 trial 倒计时                          |

### 从字节码里挖出的完整许可体系

通过 `strings` + 十六进制偏移定位 + 配合运行时日志比对，确认了整个许可流程：

**存储层（注册表）：**

```
HKCU\Software\Typora
  IDate     = "10/14/2026"   ← 安装日期，用于 trial 倒计时
  SLicense  = ""              ← 激活凭据（当前为空 = 未激活）
```

**日志痕迹（`typora.log`）：**

```
[WindowsLicenseLocalStore] SLicense : 
onUnfillLicense
[WindowsLicenseLocalStore] IDate : 10/14/2026
trailRemains is 14
[L] installDate is 10/14/2026, trail remains: 14 days
```

**字节码里的关键字符串池（对应模块和功能）：**

| 偏移   | 内容                                                   | 推断的模块功能                               |
| ------ | ------------------------------------------------------ | -------------------------------------------- |
| 83310  | `"native-reg"`                                         | 调用 Windows 注册表读写（原生模块）          |
| 83334  | `"Software\\Typora"`                                   | 注册表键路径                                 |
| 83567  | `"[WindowsLicenseLocalStore] "`                        | 许可本地存储的日志前缀                       |
| 100139 | `"deviceId"`                                           | 设备标识                                     |
| 100171 | `"[renewLicense] license renewed in 12h"`              | 12 小时续期（和我们项目一样的模式）          |
| 100304 | `"generateUUID"`                                       | 生成设备 UUID                                |
| 100338 | `"dev"`                                                | **开发版判断标志**                           |
| 103897 | `"trailRemains is "`                                   | 试用剩余天数                                 |
| 103991 | `"[L] installDate is "`                                | 安装日期日志                                 |
| 105506 | `"page-dist/license.html?ecp="`                        | 许可面板 URL                                 |
| 114051 | `"api/client/activate"`                                | 激活 API 端点                                |
| 114233 | `"Your license has exceeded the max devices numbers."` | 超设备上限提示                               |
| 117080 | `"license.machineCode"`                                | IPC 通道名（主进程 ↔ 渲染进程）              |
| 118782 | `"doDeactivation on unregistered device"`              | 注销逻辑                                     |
| 118845 | `"api/client/deactivate"`                              | 注销 API 端点                                |
| 126540 | `"File.option.hasLicense = false;"`                    | **内嵌 JS 注入片段，设置渲染进程的许可标志** |
| 127068 | `"UNREGISTERED"`                                       | 未激活水印 UI                                |

**最有意思的一条发现**（偏移 126514-127270）：有一段完整的**内嵌 JavaScript 源码字符串**，是 Typora 往渲染进程页面里注入的脚本：

```javascript
if(window.File.option){
    File.option.hasLicense = false; 
    File.megaMenu && File.megaMenu.forceReload();
    if(!document.querySelector(".<className>")) {
        const pos = Math.round(Math.random() * document.body.children.length);
        const dom = document.createElement("DIV");
        dom.style = "position: fixed !important;bottom: 2px !important; ...";
        dom.setAttribute("role", "button");
        dom.innerText="UNREGISTERED x";
        dom.addEventListener("click", () => {
            dom.remove();
            reqnode("electron").ipcRenderer.invoke(
                String.fromCharCode(108,105,99,101,110,115,101,46,115,104,111,119)
                // ^ "license.show"
            );
        });
        document.body.insertBefore(dom, document.body.children[pos]);
    }
};
```

这段代码做的事：如果 `hasLicense` 是 false，就在页面随机位置插入一个「UNREGISTERED」水印按钮，点击后弹出激活面板。

### 难点

1. **没有源码可找**：Typora 的源码不在安装目录，只有这一个编译后的 `.jsc`。
2. **webpack 打包后的整体编译**：不是「改一个函数重新编译」，是「整个应用的几百个模块被打包成一坨字节码」，想改一个条件判断必须先理解 webpack 模块边界在字节码里的样子。
3. **自研 loader**：`launch.dist.js` 不是 bytenode，是自己写的一小段 `.jsc` 加载器。它 patch 的字段和 bytenode 类似（flag hash、source hash），但代码结构不同，需要单独分析。
4. **状态存储在注册表**：不在文件系统里随便改 JSON，得操作 `HKCU\Software\Typora`。这不是「难」，是「位置不一样」。

### 但难点挡不住什么

即使加了这些层，**关键信息全部还在字符串池里**：

- API 端点（`/api/client/activate`、`/api/client/deactivate`）直接可读
- IPC 通道名（`license.machineCode`、`license.show`）直接可读
- 注册表路径（`Software\Typora`）直接可读
- 水印注入的完整 JS 源码（上面那段）直接可读
- `File.option.hasLicense` 这个标志名直接可读

攻击者不需要反汇编字节码指令流，**光看字符串池就能推断出整个架构**，然后选择性价比最高的攻击点：

| 攻击点                                                       | 需要逆向字节码？       | 预估门槛 |
| ------------------------------------------------------------ | ---------------------- | -------- |
| 改渲染进程的 `File.option.hasLicense = true`（用 DevTools 或劫持 preload） | 不需要                 | 低       |
| 劫持 `license.machineCode` IPC 返回值                        | 轻度                   | 中       |
| 写一个假的 license 服务器 + 改 hosts                         | 不需要                 | 低       |
| patch 字节码里的条件跳转                                     | 需要（view8 级别）     | 高       |
| 完整重编译 `.jsc`                                            | 需要且版本必须精确匹配 | 最高     |

实际上，**对这个版本的 Typora，网上公开的破解几乎都走的是「劫持 IPC + 伪造服务器响应」或「DevTools 改运行时状态」这两条路**，没人去硬啃字节码——因为字符串已经把攻击面全暴露了。



# 四、不修改 `app.asar` 的其他攻击面

按攻击发生的位置，可以分成六类。改 asar 是「永久、离线、一次操作永久生效」的基准；六类里有的是「临时、每次都要做」，有的是「只能骗 UI 骗不了功能」，有的是「理论上可行但组合条件苛刻」。**没有一个能像改 asar 那样，改一次就永久拥有完整功能。**

### 1. 六类不碰 asar 的攻击面

| 攻击面       | 原理                                                         | 对应层   |
| ------------ | ------------------------------------------------------------ | -------- |
| 本地状态篡改 | 直接改注册表 / `license.json`，伪造「上次验证的结果」        | 存储层   |
| 公钥替换     | 换掉客户端验签用的公钥，改成攻击者自己的公钥，然后自己签凭据 | 信任锚   |
| 渲染进程注入 | 改 `page-dist` 里的明文 JS，或通过 DevTools 协议往运行中的进程里塞代码 | UI 层    |
| 运行时 Hook  | 用 Frida / DLL 注入，在函数被调用的瞬间替换它的返回值        | 内存层   |
| 网络劫持     | 代理 / hosts 劫持续期请求，返回攻击者准备好的响应            | 网络层   |
| 环境变量     | `ELECTRON_RUN_AS_NODE`、`NODE_OPTIONS` 这类，改变 Electron 运行时行为 | 运行时层 |

### 2. 这些攻击在 Typora 上分别会遇到什么，以及效果和改 asar 的差异

1. **本地状态篡改（注册表 / license.json）**

   对比改 asar：

   - 改 asar：改一次，永久激活。主进程代码直接被换掉，没有「续期」这个概念来打脸。
   - 改注册表：Typora 的场景下，改 `SLicense` 只能骗过一次启动检查。12 小时后 `renewLicense` 会带着 `deviceId` 去服务器换新凭据，服务器不认伪造值，返回失败 → `onUnfillLicense` → 降级。

   **我们项目里对应的**：`src/license/license.json` 存在 userData 下，`writeStoredLicense()` 把服务器签的凭据存进去。你直接改这个 JSON 不行，因为 `verifyCredential()` 会用内嵌公钥验签，签名不对直接判 `signature-mismatch`。

   **效果对比结论**：改 asar 能骗过一切，改状态只能骗过「读取状态」这一个环节。差距在于「是否绕过了验证逻辑本身」。
2. **公钥替换**

   对比改 asar：

   - 改 asar 的时候公钥跟着你重编译一起换，这是「顺手的事」。

   - 单独做公钥替换（不改 asar）需要公钥存在独立文件里。我们项目的 `server-public-key.pem` 就是独立文件！攻击者可以：

     ```
     Copy-Item attacker-public-key.pem src/license/server-public-key.pem
     ```

     然后攻击者用自己的私钥签凭据，本地验签就会通过——

     但前提是他还得把伪造的凭据写进 `license.json`，而且要绕过 12 小时续期

     。这在我们项目里是可行的，因为没有额外校验公钥文件本身。

   **Typora 的情况**：公钥嵌在 `.jsc` 里，这个攻击面被堵死，必须回改字节码。

   **效果对比**：如果我们项目被这条路打穿，效果**等同改 asar**——功能全部可用。这是六类里唯一能到「等同改 asar」效果的单点攻击。但也只在「公钥独立存放」的场景成立。
3. **渲染进程注入**

   对比改 asar：

   - 改 asar：主进程逻辑彻底换掉，功能真实可用。
   - 渲染进程注入：只骗 UI。比如我们项目 `renderer/renderer.js` 里如果有个 `licenseStatus` 显示区，攻击者往浏览器 DevTools 里执行 `document.querySelector('.status').innerText = '已激活'`，界面显示激活了，但点「保存」按钮，IPC 发到主进程，主进程的 `requireActivation()` 一查缓存还是没激活，照样拦截。

   **我们项目实际有这个入口吗？** 没有——`renderer.js` 只是通过 `preload.js` 调 `licenseState()` 拿状态，没有判断逻辑。所以这条路在我们项目上是「只能骗显示」，主进程的闸门还是真实的。

   **效果对比结论**：效果是「看起来像激活了」和「真的能保存文件」之间的差距。**视觉上骗人，功能上骗不了。**
4. **运行时 Hook（Frida）**

   对比改 asar：

   - 改 asar：文件被换掉，进程启动时加载的就是攻击者代码。
   - Frida：文件没动，进程启动后攻击者动态修改内存里的函数返回值。

   **在我们项目里具体对应**：`requireActivation()` 返回 `{ allowed: true }` 那个函数，Frida 脚本找到它的入口地址，把返回值改掉。效果和改 asar 的第二步**完全一样**——保存功能解锁。

   **但有个本质区别**：

   - 改 asar：持久。下次启动还是激活状态。
   - Frida：**每次启动都得重新注入**。进程重启后内存里的修改就没了。

   所以 Frida 适合「我要用一次，用完关掉」的场景，不适合「我要长期免费使用」。商业软件对抗 Frida 靠的是运行时检测（反调试、完整性检查）+ 硬件加密狗，这些 Typora 都没有。

   **效果对比**：**功能上等同改 asar，持久性上不如改 asar**。
5. **网络劫持**

   对比改 asar：

   - 改 asar：不联网也能用（把验证逻辑换掉了）。
   - 网络劫持：必须联网，还得让客户端「信」一个假服务器。

   **我们项目里的具体路径**：

   - 客户端 `renewLicense()` POST 到 `/api/client/renew`，期望拿到签名的凭据 JSON
   - `verifyCredential()` 用 `server-public-key.pem` 里的公钥验签
   - 攻击者要做的：拦截 HTTPS / hosts 劫持 + 准备一个自签证书 + 用自己的私钥签凭据 + **把公钥文件换成自己的公钥**

   看到了吗？**这条路必须和「公钥替换」组合**。单独做网络劫持，`verifyCredential()` 一验签就 `signature-mismatch`，拦截成功。

   **Typora 的情况**：公钥在字节码里，这个组合打不通，所以网络劫持也被堵死。

   **效果对比**：**单独用效果为零**，和公钥替换组合后等同改 asar。而且因为要维持劫持状态，持久性不如改 asar。
6. **环境变量**

   对比改 asar：

   - 改 asar：改的是「代码」。
   - 环境变量：改的是「运行时行为」。

   **`ELECTRON_RUN_AS_NODE=1` 在我们项目上的实际效果**：前面你亲眼见过——应用直接崩，`require('electron')` 拿到的是字符串不是 API。这不是「绕过激活」，是「把应用弄挂」。**没有攻击价值。**

   **但其他环境变量可能有价值**：比如 `NODE_OPTIONS=--require=attacker.js`（Node 的预加载钩子），可以在主进程启动前注入代码。这个是真实的攻击面，Electron 的高版本里有 patch 过，但不是所有版本都堵死。实测：Typora 的 fuse 配置里 `EnableNodeOptionsEnvironmentVariable: Enabled`，说明这条注入路径在 Typora 1.12.4 上是开着的。

   **效果对比**：大多数环境变量是「把应用弄坏」，少数（`NODE_OPTIONS`）可以「注入代码」，后者等同改 asar。

### 3. 总结表：效果等价性

| 攻击方式                | 能否解锁保存功能 | 持久性             | 是否需要组合   | 和改 asar 的效果差距 |
| ----------------------- | ---------------- | ------------------ | -------------- | -------------------- |
| 改 asar                 | ✅                | ✅ 永久             | 不需要         | 基准                 |
| 改注册表 / license.json | ❌                | -                  | 需要配合其他   | 骗不过验签           |
| 替换公钥（我们项目）    | ✅                | ✅ 永久             | 不需要         | **等同改 asar**      |
| 替换公钥（Typora）      | ❌                | -                  | 绕回改字节码   | 被堵死               |
| 渲染进程注入            | ❌                | -                  | 不需要         | 只骗 UI              |
| Frida 运行时 Hook       | ✅                | ❌ 每次启动重新注入 | 不需要         | 功能等同，持久性差   |
| 网络劫持单独            | ❌                | -                  | 需配合公钥替换 | 验签拦截             |
| 网络劫持+公钥替换       | ✅                | ✅                  | 需要组合       | 等同改 asar          |
| `ELECTRON_RUN_AS_NODE`  | ❌（把应用弄坏）  | -                  | -              | 无攻击价值           |
| `NODE_OPTIONS` 注入     | ✅                | ✅                  | 不需要         | 等同改 asar          |
