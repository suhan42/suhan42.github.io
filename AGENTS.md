# AGENTS.md

> 本文件是项目级固定开发准则，面向后续所有 AI 协作会话；全局指南的通用规则依然适用，冲突时以更严格者为准。

创建日期：2026-11-06
修改日期：2026-11-10

## 0. 核心信条

- 查询胜过猜测，确认胜过假设；复用胜过重复造轮子。
- 测试胜过跳过，遵循规范胜过随意；谨慎胜过盲目。
- 如实记录不确定性与风险，主动学习并持续改进。
- 涉及方案选择或结构性变更（重构、迁移、目录调整、删改功能、引入依赖、技术选型）时，先分析合理性、代价和替代方案，经用户确认后再执行，不得未加分析就直接动手；简单事实问答可直接回答。
- 遇到问题或同一操作连续三次以上无进展时，立即提出来询问用户，不要自己卡住原地转圈。
- 每次修改代码遵循最小修改原则，优先使用简单、直接、可读的逻辑；不过度封装、过度兼容或无依据扩展。新增或修改复杂逻辑时添加必要的中文注释说明关键意图和边界。
- 注释换行约定：一个完整的句子写在同一行内，不因长度拆成多行；分层说明按"一层意思一条长行"组织。
- 所有沟通、代码注释和文档使用中文；新文件 UTF-8 无 BOM。

## 1. 文档分工与维护

- `README.md` 做"总资料"（最详细，包含项目结构、快速开始、写作流程和发布方式）；`AGENTS.md` 只做 AI/agent 的参考和行为规范文档；`CLAUDE.md` 引用 `@AGENTS.md`。
- `docs/archive/2026-11-migration/current-analysis.md` 是迁移前的现状分析证据；`docs/target-architecture.md` 是目标架构唯一事实来源；`docs/migration-plan.md` 是阶段任务和回滚边界；`docs/content-inventory.md` 是内容清点表；`docs/legacy-url-map.md` 是旧 URL 清单；`docs/release-checklist.md` 是人工发布验收清单。
- 文档中有创建日期和修改日期。
- 每次修改代码、模板、配置或脚本后，主动判断是否需要更新 `docs/changelog.md` 和相关文档（README、目标架构、迁移计划、发布清单、内容清点表）；结构性变更、新功能、目录调整或依赖变更必须更新，小修小补可跳过。不需要更新时在最终回复中简要说明判断结果即可。
- 文档表格、清单和状态快照中的完成状态统一用 `√` 表示，不写"已完成"；清理过时描述时直接删除旧描述，不逐条改写"不再使用"。**Markdown 任务列表语法例外**：`- [ ]` / `- [x]` 复选框是语法关键字，完成项写 `- [x]`、未完成写 `- [ ]`，不能把 `√` 塞进方括号；`√` 约定只适用于表格单元格和状态行等非 checkbox 语境。

## 2. 工具与验证（固定命令）

- 工具顺序：`git status --short` 确认现场 → `rg --files` 或 glob 找文件 → 读文件 → `rg` 查关键字 → `apply_patch` 改文件 → 验证。不用 `cat > file` 这类整文件覆盖写法。
- Node.js 版本要求 >= 20；构建期依赖通过 npm 管理，不使用 Python 或 Ruby 构建工具。
- Eleventy 构建命令在 P2 实现后通过 `npm run build` 触发；P2 完成前不得伪造验证结果，如实报告当前可用命令。
- 前端或模板改动后按发布清单逐项人工验收，不跳过视觉和交互检查。
- 收尾必跑 `git diff --check`。
- 服务与系统重启纪律：不随意重启操作系统或后台服务；即使判断重启是必要手段，也先说明目标、影响和替代方案，获得明确确认后才执行。
- Git 纪律：严禁自行 `git add` / `git commit`；用户要求"写 commit / commit message / 重写 commit"时，只输出拟提交标题与正文文案，绝不执行 `git add` 或 `git commit`，也不猜测用户隐含了提交意图；只有用户明确说出"执行提交 / 创建 commit / 提交到 git"才允许操作；标题括号 scope 写本次变更的具体模块、页面、接口或业务域。

## 3. 内容与架构约定

### 3.1 目录职责

| 目录 | 职责 | 是否进文章集合 |
|---|---|---|
| `src/content/posts/` | 文章源，`.md` 和文章型 `.html` | 是 |
| `src/content/custom/` | 独立特殊页，完整 HTML 文档 | 否 |
| `src/content/pages/` | About 等固定页面 | 否 |
| `src/_includes/layouts/` | 布局模板 | 否 |
| `src/_includes/partials/` | 可复用组件模板 | 否 |
| `src/_data/` | 站点配置和特殊页元数据 | 否 |
| `assets/` | 站点静态资源 | 否 |
| `site/` | 构建产物，唯一发布目录 | 否 |
| `docs/` | 项目文档 | 否 |

### 3.2 内容源规范

每篇文章必须 UTF-8 无 BOM，front matter 必填字段：

```yaml
title: 非空
date: YYYY-MM-DD
slug: 只允许小写英文、数字和连字符，全站唯一
category: 受控分类
summary: 可选；需要精确控制列表、RSS 和搜索摘要时填写，缺省时取正文第一段
status: published 或 draft
```

`tags` 可选；`cover` 可选，格式为 `/assets/images/...`。

文章型 HTML（如《白色相簿2》攻略）与 Markdown 文章同等对待，都放 `src/content/posts/`，都要求完整 front matter；正文保持 HTML 不转 Markdown。独立特殊页（divergence、fireworks、box）放 `src/content/custom/`，不进文章集合，首页展示通过 `src/_data/custom-pages.json` 管理。

站内图片引用统一写作 `/assets/images/...`；禁止 `./`、`../` 和 Windows 反斜杠路径。

### 3.3 路由规则

| 内容类型 | 路由格式 |
|---|---|
| 文章页 | `/posts/{slug}/` |
| 分类页 | `/categories/{category}/` |
| 标签页 | `/tags/{tag}/` |
| 特殊页 | `/custom/{slug}/` |
| 归档页 | `/archive/` |
| 关于页 | `/about/` |

旧 URL 的跳转策略见 `docs/legacy-url-map.md`。

### 3.4 模板与安全

模板变量默认转义。只有站点配置和受控生成的 HTML 可以显式标记 safe；禁止客户端代码用未转义字符串拼接文章数据。

`node_modules/` 不进入 git；站点资源不引用 `node_modules` 内文件。highlight 样式复制到 `assets/vendor/`。

### 3.5 设计参考

进行页面、组件或交互设计时，可参考以下站点中的组件、页面结构和交互案例，重点学习信息层级、布局密度、排版、留白、色彩和交互状态：

- [RareUI](https://www.rareui.com/)
- [ExpoKit Components](https://expokit.in/docs/components)
- [beUI](https://beui.dev/)

参考对象是这些站点的设计实现，不是其业务内容本身。只借鉴设计原则和交互模式，不复制品牌标识、插画、文案或整页布局；不得覆盖本站既有的夜航/纸墨双主题与内容优先原则。前端或模板改动完成后仍按发布清单进行人工视觉和交互验收。

## 4. 构建与发布

- 构建产物 `site/` 提交到仓库；GitHub Pages 发布源固定为 `gh-pages` 分支根目录（由 `site/` 子树生成），不得把 `main` 根目录设为 Pages 源，也不得把 `gh-pages` 合并回 `main`；构建、验收和发布由人工执行，不使用 CI/CD。
- 发布命令固定为：`npm ci` → `npm run validate:content` → `npm run test:markdown` → `npm run test:theme` → `npm run build` → `npm run validate:output` → 人工验收 → 用户明确要求提交时才 `git commit` → 推送 `main` → `npm run publish:pages:check` → `npm run publish:pages`。
- 发布产物必须在本地构建和验收通过，合并到 `main` 并经用户确认推送后，再同步到 `gh-pages` 发布分支。

## 5. 已知坑与边界

- Windows 工作区 CRLF、git 存储 LF 是当前状态；新文件用 LF 写入，依赖 `.gitattributes` 统一。
- PowerShell 终端中文显示可能乱码，是显示层问题不是数据问题；文件编码用字节级或 Node 检查确认。
- 当前 sandbox 对 `.git` 写入受限，分支和标签创建需要用户放行；文档和内容文件正常编辑不受影响。
- 纯浏览器解析 Markdown 不作为主方案：GitHub Pages 对裸 Markdown 内容协商不可靠，SEO 弱，分类、标签和分页逻辑不适合堆积在客户端。

## 6. 任务日志

- 复杂、多步骤或项目级任务维护任务日志；简单问答和小改动无需落盘。当前迁移任务的阶段状态由 `docs/release-checklist.md` 承担，具体变更由 `docs/changelog.md` 承担，两者按阶段同步更新。
