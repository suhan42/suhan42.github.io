# 当前方案分析

更新时间：2026-11-06

本文记录本次迁移前的项目现状、真实运行链路、已确认的技术风险，以及 Hexo、Jekyll 和 Eleventy 的对比结论。它是开发计划与目标架构的证据基础，不是日常写作或发布手册。

## 结论摘要

当前项目不是“Markdown 直接上传到 GitHub Pages 就能发布”的简单静态站，而是一个自研的轻量静态博客生成器。主链路已经在线上可用，但内容元数据、路由、模板、依赖资产和前端数据源都需要正式化。

现有方向不需要推翻：项目已经实现了“Markdown 转 HTML、生成首页数据、渲染目录和分页”的最低配静态博客流程。真正的问题是没有把文章当作完整数据对象管理。因此，短期应先把内容源正式化；如果项目目标继续是长期维护的个人博客，中期迁移到 Eleventy 是合理方案。

## 已确认事实

### 仓库与线上状态

开始本次分析时，工作区干净，分支为 `main`，与 `origin/main` 同步。线上站点 `https://suhan42.github.io` 返回 HTTP 200。README 与 `posts/` 下的 Markdown 文件均为 UTF-8 无 BOM；git 中按 LF 存储，Windows 工作区检出为 CRLF。

### 当前运行链路

当前生产链路可以概括为：

```text
posts/*.md
  ↓ PostToHtml_and_CreateHomeData.js
htmls/*.html
  ↓ create_home_data()
home_data.json
  ↓ pagination-container.js
index.html 首页目录、摘要、封面和分页
```

[PostToHtml_and_CreateHomeData.js](../PostToHtml_and_CreateHomeData.js) 同步读取 `posts/`，使用 marked 和 highlight.js 转换文章，拼入生成模板后写入 `htmls/`。随后脚本扫描 `htmls/` 生成 [home_data.json](../home_data.json)。首页由 [pagination-container.js](../pagination-container.js) 渲染文章目录和分页。

根目录的 `PostToHtml_and_CreateHomeData.js` 是当前有效入口。`tools/` 下的旧脚本读取过 `markdown/`、输出到 `html/`、读取过 `view/footer.html`，与当前目录名不一致，应视为历史实验脚本，不代表当前链路。

### 内容源与元数据

`posts/` 内现有九个 Markdown 文件和一个 HTML 源文章。文章标题来自文件名；首页数据中的标签硬编码为 `null`。当前没有 `title`、`date`、`slug`、`category`、`tags`、`summary`、`cover` 和 `status` 等结构化元数据。

生成脚本使用文件系统 `mtime` 当作文章时间。重新 clone、移动文件、换设备或批量工具重写文件都会改变旧文章排序。当前仓库中 2023 年文章的文件系统时间已经显示为 2026-11-06，说明 `mtime` 不能继续作为发布时间来源。

摘要由生成器截取 HTML 中第一个 `<p>` 到 `</p>` 的内容。该方式对目录、引用块、图片、短文和空段落不稳定，且摘要本质上是作者意图，不应继续由页面结构反推。

### 路由与 URL

生成页路径直接使用文件名，现有链接包含中文、空格、`&` 和书名号，例如 `./htmls/静态博客框架之Hexo & Jekyll.html`。浏览器和 GitHub Pages 通常能处理这类路径，但会造成分享链接难看、编码行为跨平台不一致、HTML 属性中的特殊字符风险和搜索索引不稳定。

`home_data.json` 中还出现过 `.\images\git\work.png` 这类 Windows 反斜杠路径。Web URL 应统一使用 `/`，这一点必须由生成器或内容规范强制保证。

### 页面模板与前端数据

header 与 footer 在 `index.html`、文章生成模板、`plugins/footer.html` 和 `plugins/about.html` 中重复维护。分类与标签硬编码在侧栏和页脚里。每新增文章、分类、标签或调整导航，都可能需要修改多个入口。

`home_data.json` 与 `pagination-container.js` 是两份文章数据源。首页实际加载的不是 JSON 文件，而是脚本内手工拷贝的数据，再拼接硬编码 `old_data`。构建器更新 `home_data.json` 后，首页不一定变化；数据漂移已经是现实风险。

首页渲染使用字符串拼接和 `innerHTML` 插入标题、摘要、日期和图片地址，没有统一 HTML 转义。当前内容全部由本人维护，实际风险低，但该结构不能推广到外部输入或自动化内容。

### 依赖与站点资产

本机为 Node.js `v22.19.0` 与 npm `10.9.3`。项目声明并实际安装了以下运行依赖：

| 依赖 | 项目版本 | npm 当前版本 | 说明 |
|---|---:|---:|---|
| marked | 4.2.5 | 18.1.3 | 新版要求 Node.js >= 20，API 与 4.x 不兼容 |
| highlight.js | 11.7.0 | 11.12.0 | 当前生成页直接引用 node_modules 内样式 |
| require.js | 1.0.0 | 1.0.0 | 未在当前主链路中看到明确价值 |

npm registry 当前显示 `@11ty/eleventy` 最新版本为 `3.1.8`，要求 Node.js >= 18；Hexo 最新版本为 `8.1.2`，要求 Node.js >= 20.19.0。本机环境均满足。

`node_modules/` 当前被 git 跟踪，统计到 1319 个文件。生成模板还引用 `../node_modules/highlight.js/styles/github.css`。运行依赖被误当成站点资产，发布产物依赖整个依赖安装目录；后续依赖清理、重装或目录调整都可能造成样式 404。

项目当前没有 `.nojekyll`。GitHub Pages 会按 Jekyll 约定处理部分下划线开头目录；迁移后的输出目录和静态资源应加入 `.nojekyll`，避免非必要处理。

当前文章里的 marked 用法是 4.x 时代的 `marked.lexer()` 与 `marked.parser()`。生成模板中的 `highlight: function(code)` 也是 marked 4.x 回调，不能直接迁移到新版 marked。若先升级 marked，需要按新版 API 重写；若迁移 Eleventy，marked 最终会退役。

### 安全边界

Markdown 正文中的 HTML 会被 marked 原样保留，当前自研链路没有额外净化。项目内容目前全部由本人编写，风险可控；但这是“作者可信输入”的边界，不是通用安全设计。未来引入投稿、外部抓取、自动化生成或评论内容时，必须先建立净化策略。

文章生成模板中存在 `<base target="_blank">`。内部导航通过显式 `target="_self"` 抵消，但全局默认在新标签打开不一定是合理语义，迁移时应逐类链接重新声明行为。

## Hexo 与 Jekyll 的机制

Hexo 是 Node.js 生态博客框架，典型流程为 `source/_posts/*.md` 读取 YAML front matter，建立文章集合，渲染 permalink、分类页、标签页和归档页，输出 `public/`。它不是单纯转换工具，而是先建立文章对象，再由主题模板消费这些对象。

Jekyll 是 Ruby 生态静态站点生成器，也是 GitHub Pages 的传统原生方案。它依赖 `_posts/YYYY-MM-DD-title.md` 文件约定、YAML front matter 和 Liquid 模板，把文章暴露为 `site.posts` 集合。它的优势是 Pages 原生认识它，但当前项目已经是 Node 生态，且平台内置 Jekyll 版本和插件限制会降低自由度。

两者的共同本质是：内容源 + front matter + collection + 模板 + permalink + 多类页面。当前自研方案已经实现最低配版本，缺少的是正式元数据、稳定路由、模板复用和聚合页体系。

## Eleventy 的定位

Eleventy 是零客户端框架的静态站点生成器，支持 Markdown、front matter、layout、collection、pagination、permalink、模板复用和自定义输出目录。它不在浏览器运行，也不要求页面使用某个前端框架，适合保留当前自定义视觉。

与继续扩展自研生成器相比，Eleventy 能直接解决 collection、标签页、分类页、归档、分页和模板继承这些重复工程问题。与 Hexo 相比，它的约束更少，不会强制使用完整主题体系。与 Jekyll 相比，它与当前 Node.js 生态一致，不需要引入 Ruby。

## 方案对比

| 方案 | 优点 | 缺点 | 判断 |
|---|---|---|---|
| 继续升级自研 | 现有 UI 容易保留，学习价值高，短期改动可控 | front matter、collection、permalink、标签页、归档、RSS、搜索都要继续手写，长期维护成本上升 | 可作为过渡，不适合长期主线 |
| Eleventy | 零客户端框架，Markdown 和 collection 能力成熟，模板清晰，适合长期写作 | 需要一次性迁移模板和构建流程 | 目标方案 |
| Hexo | 博客功能完整，中文资料多，现成主题多 | 主题体系约束强，现有自定义 UI 需要重新适配 | 可选，但对本项目约束偏高 |
| Jekyll | GitHub Pages 传统原生方案，不需要本地 Node 构建 | Ruby 环境与当前 Node 生态断裂，Pages 内置能力和插件受限 | 不推荐 |

## 决策

第一优先级是补齐所有内容源的 front matter，包括旧 HTML 源文章的等价元数据。`title`、`date`、`slug`、`category`、`tags`、`summary` 和 `status` 必须由内容本身提供。无论继续自研、迁移 Eleventy、Hexo 还是 Jekyll，这项工作都不会浪费。

第二优先级是在内容数据稳定后迁移 Eleventy。现有视觉不推倒重来，应拆成 base layout、home layout、post layout、sidebar、footer、post card 和 pagination 等可复用模板。不推荐继续把旧生成器扩展到标签页、归档、RSS 等复杂功能，因为这些能力 Eleventy 已经标准化。

纯浏览器解析 Markdown 不作为主方案：GitHub Pages 对裸 Markdown 内容协商支持不可靠，SEO 弱，首屏依赖客户端解析，分类、标签、分页和搜索逻辑会继续堆积在客户端。

目标文件树、目录职责、数据模型、模板体系和发布输出见 [target-architecture.md](target-architecture.md)。阶段拆分、验收标准、回滚边界和风险控制见 [migration-plan.md](migration-plan.md)。
