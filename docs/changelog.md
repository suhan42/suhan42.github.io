# 变更日志

最新内容放前面；同一天合并写，聚焦具体内容，不记录过多 git 操作。

## 2026-11-10

### 首页首图封面与卡片改版

- 首页文章卡片改为自动读取构建后正文的第一张真实 `<img>`，front matter `cover` 保留为显式覆盖；无图文章不渲染图片位，只输出纯文字卡。
- 修复旧卡片模板误读 `post.cover` 导致 front matter 封面不生效的问题，统一改读 `post.data.cover`。
- 卡片改为等高网格，有图和无图卡片外框尺寸一致；取消首条放大主卡和阅读入口箭头，收紧图片宽度、字号与间距。
- 新增 `firstImage` 过滤器，只匹配已渲染 HTML 的 `<img src>`，会跳过注释、`data:` / `blob:` 地址；代码块中的图片示例不会被误判。
- 有图卡片增加 CSS-only 左侧帘幕揭示：图片默认只露出一部分，hover 或键盘聚焦时用 `clip-path` 展开为完整缩略图；图片框同时变宽，正文右移，缩略图独立放大到 `1.18` 并允许轻微溢出原框。减少动态效果模式取消过渡和整卡缩放，但保留图片的即时放大状态。
- hover 揭示不再依赖主指针的 `hover` / `pointer` 媒体特性，兼容触摸屏笔记本；三份 CSS 的版本参数改由内容哈希生成，避免忘记手工升级缓存版本。
- 首图提取逻辑拆到 `scripts/first-image.mjs`，新增 `npm run test:first-image` 覆盖正常首图、注释、代码文本、data/blob 和属性边界。
- 卡片间距从 16px 调到 20px，窄屏为 18px；减少动态效果模式只保留图片放大，不再改变图片框宽度和正文位置。
- 揭示动画参考 Aceternity UI 的 Direction Aware Hover 与 Hover Image Links，只借鉴“图片随交互出现”的行为，不引入 React、Motion 或新依赖。
- 卡片组件同时复用于分类页和标签页，这些列表也会自动使用正文首图和同一套图文卡样式。
- 视觉参考 beUI 的深色留白、细边框和层级，以及 ExpoKit 的紧凑卡片栅格；RareUI 访问被 Vercel 安全检查拦截，未作为实证依据。

### 文档对账与当前状态收口

- 按仓库实际状态重写 `README.md` 的当前状态：迁移已完成并上线，`main` 承载源码和 `site/`，`gh-pages` 承载发布产物。
- 更新 `docs/migration-plan.md`：P5 改为收尾中，补充旧链路清理、`site/` 与 `gh-pages` 一致性、线上抽查和剩余收尾项。
- 更新 `docs/release-checklist.md`：回填旧脚本删除、`node_modules` 退出跟踪、Pages 发布行为等状态；保留日期、受控分类/标签、人工视觉验收和提交确认等未完成项。
- 重写 `docs/legacy-url-map.md`：记录 14 个已生成跳转页和 `views/fireworks2.html` 的待确认状态。
- 重写 `docs/content-inventory.md`：改为当前 `src/content/posts/` 和 `src/content/custom/` 的实际清单，历史 P0 快照只保留在 git 历史和 `pre-eleventy-migration` 标签。
- 修正 `docs/target-architecture.md`：按实际目录更新文件树、`.nojekyll` 位置、集合名称和依赖说明，移除不存在的 `.eleventyignore`、`.editorconfig` 和根目录 `.nojekyll` 描述。
- 当前验证：`validate:content` 通过 10 个文件，`validate:output` 通过 55 个 HTML 页面；`site/` 177 个跟踪文件，`gh-pages` 与 `main` 中 `site/` 子树一致。
- 当前待确认：日期和受控分类/标签的确认记录、`views/fireworks2.html` 的退役结论、vendor 未使用资源清理、代码高亮视觉验收。
- `validate:output` 改为从 `src/content/posts/` 的 front matter 动态读取 published/draft，移除写死的 10 篇和 `photo-test` 文件名；新增共享 `scripts/front-matter.mjs`。
- 新增 `src/_data/themes.json` 作为主题名称、标签、theme-color 和系统默认主题的唯一来源；菜单、首帧脚本和 `theme.js` 都从该文件读取。
- 新增 `scripts/test-markdown.mjs` 和 `npm run test:markdown`，覆盖自定义 Markdown 规则及代码保护边界，共 12 项 fixture。
- 输出校验补充相对路径资源和 `node_modules` 属性检查；front matter 结束标记改为只匹配独立一行；主题变量拆到 `assets/css/themes.css` 并增加 `npm run test:theme`。
- KaTeX 字体精简为 20 个 woff2，移除 40 个 woff/ttf 文件和 CSS 回退；发布资源从 181 个降到 141 个，`site/` 当前共 201 个文件。
- `scripts/prune-katex-fonts.mjs` 改为先校验 CSS 回退是否摘净再删除字体文件：正则不匹配时 fail-fast 退出并保留字体，避免留下指向已删文件的 404 引用。
- 发布命令链补上 `test:markdown` 和 `test:theme`，`AGENTS.md`、`README.md`、`docs/release-checklist.md`、`docs/target-architecture.md`、`docs/migration-plan.md` 同步。
- `README.md` 的样式说明更新为 `themes.css` / `main.css` / `markdown.css` 三份加载，并清理发布命令块里的多余空行。
- 将 Markdown 正文、代码块、数学公式、表格和 Callouts 从 `main.css` 拆到 `assets/css/markdown.css`，页面按主题变量、基础组件、内容层顺序加载。
- Nocturne 和 Nocturne Bright 的主要正文排版对齐 paper：`17px`、`400` 字重、`1.75` 行高，`strong` 对齐 `700`。
- 新增 `docs/markdown代码块渲染分析.md`：确定 Shiki 4.6.0 直接接管 markdown-it 的方案，记录 Node >=20 与 markdown-it 15 的版本冲突、markdown-it 15 / Eleventy 4 canary 的升级风险、直接接入方式、Node 18 回退到 Shiki 3.3.0 的路径，以及 Typora 仅作为视觉参考的边界。
- 新增 `docs/archive/` 归档目录，将迁移前的 `docs/current-analysis.md` 移入 `docs/archive/2026-11-migration/`；活动文档继续保留在 `docs/` 根目录。

### Node 版本与旧高亮资源清理

- `package.json` 和 `package-lock.json` 根包新增 `engines.node >=20`；README、AGENTS.md、迁移计划和发布清单同步最低版本要求。
- 删除 `assets/vendor/highlight-github.css`，并从 `src/_includes/layouts/base.njk` 移除引用；重建 `site/` 后不再发布旧样式文件。
- 安装 `shiki@4.6.0` 和 `@shikijs/transformers@4.6.0`，在 `eleventy.config.js` 直接接管 markdown-it 的 `highlight`，使用 `github-light` / `github-dark` 双主题、`bundledLanguages` 全语言集、统一小写语言名和行号。
- 重建 `site/` 后代码块输出 `<pre class="shiki">`，行号和主题变量已生成；日志不再出现 SQL/SHELL 未知语言警告。
- Playwright 检查通过：C 自查表和 MySQL 自查表在 `night` / `paper` / `nocturne` / `nocturne-bright` 四套主题下 token、背景和行号正常，390px 下代码块内部横向滚动正常；MySQL 文章长 URL 的页面横向溢出为既有正文问题，已单独记录。

### 四套站点主题

- 保留原有 `night` 夜航深色和 `paper` 纸墨浅色，不覆盖旧色板。
- 新增 `nocturne` 和 `nocturne-bright` 两套主题，分别接入 Nocturne 深色和 Nocturne Bright 浅色的字体栈、背景、表面、正文、标题分级色、链接、下划线、强调、行内代码、引用、表格、列表、分隔线、图片和标记色。
- 主题入口从单按钮改为原生 `details` 菜单，支持四套主题选择、localStorage 持久化、系统主题跟随、外部点击关闭和 Esc 关闭。
- `theme-color`、Works 印章强调色和 Shiki 代码块背景/行号选择器同步覆盖四套主题。
- 链接下划线和 `==` 高亮按主题使用独立强调色：夜航蓝、纸墨棕、Nocturne 紫、Nocturne Bright 紫。

### Markdown 行内高亮

- 在 `eleventy.config.js` 接入 `scripts/markdown-it-mark.mjs`，支持 `==文字==` 生成 `<mark>`，不新增第三方依赖。
- 规则支持嵌套强调和连续高亮，并避免把普通 `==` 比较表达式误判为高亮。
- `night` / `paper` 增加高对比度 `<mark>` 样式，Nocturne 两套主题使用紫色高亮；高亮文字加粗并支持多行克隆背景。
- 新增 `typora手册.md`，修正 `mrakdown` 标签拼写、补充正式摘要并清理行尾空格；当前 published 文章为 10 篇，标签页为 21 个。

### KaTeX 数学公式

- 安装 `katex@0.19.1`，在 `eleventy.config.js` 接入 `scripts/markdown-it-katex.mjs`，支持行内 `$...$` 和块级 `$$...$$`。
- 公式在构建期生成 KaTeX HTML，不依赖 MathJax 客户端脚本；无效公式会显示错误标记并由输出校验拦截。
- 将 KaTeX 样式和字体复制到 `assets/vendor/katex/`，页面只引用站点本地资源，不引用 `node_modules`。

### Typora 上下标

- 新增 `scripts/markdown-it-subsup.mjs`，支持 `H~2~O` 下标和 `y^2^=4` 上标。
- 单字符 `~` / `^` 走上下标规则，双 `~~` 继续交给删除线；行内代码和 KaTeX 公式不会被误处理。

### GitHub/Typora Callouts

- 新增 `scripts/markdown-it-github-alerts.mjs`，把 `> [!NOTE]`、`> [!TIP]`、`> [!IMPORTANT]`、`> [!WARNING]`、`> [!CAUTION]` 转成 callout。
- 五种 callout 使用高饱和语义色作为标题、图标和左边框颜色，并增加 Bootstrap Icons 图标。
- 文章源里的 callout marker 会在构建时移除，不再显示为字面量 `[!NOTE]`。

### 发布链路修正

- 确认 GitHub Pages 构建失败的原因是发布源指向 `main` 根目录，内置 Jekyll 扫描到 `src/archive.njk` 后按 Liquid 解析 Nunjucks 语法并报错。
- 创建并推送 `gh-pages` 分支，由 `site/` 子树生成；分支根目录直接包含 `index.html`、`.nojekyll` 和完整静态产物。
- 更新发布文档：GitHub Pages 发布源固定为 `gh-pages` 根目录，后续人工构建、提交并推送 `main` 后，用 `npm run publish:pages` 同步发布产物。
- 补充发布源决策：记录 `main`、`gh-pages`、Pages 设置和构建分支的职责边界，并写明 Actions、`main` 的 `/docs`、根目录直出等替代方案不采用的原因。
- 新增 `scripts/publish-pages.mjs` 和 npm 发布脚本：发布前检查 `main` 分支、`site/` 提交状态、必需产物和远端配置，默认只检查，确认后才推送 `gh-pages`。
- 当时本地验证通过：内容校验 10 个文件、构建 44 个输出文件、输出校验 55 个 HTML 页面。

## 2026-11-09

### 站点视觉重做

- 重写 `assets/css/main.css`，建立 `night` 夜航深色和 `paper` 纸墨浅色两套主题变量，统一卡片、侧栏、分页、文章阅读线、表格和代码块的表面、边框与文字层级。
- `base.njk` 增加首帧主题恢复和 `theme-color`，没有保存值时跟随系统配色；新增 `assets/js/theme.js`，负责手动切换、持久化、系统偏好变化和无障碍标签。
- 首页重构为 hero 和 Latest 两个主分区；Works 移入右侧栏做三行毛玻璃索引，works 元数据集中到 `src/_data/custom-pages.json`，首页和侧栏共用同一份数据。
- Works 右栏索引保持约 192px 高，使用半透明表面、毛玻璃、材质色印章、hover 边框和箭头滑入；主内容不再被 Works 大卡片截断。
- 站点品牌标记从文字 `S` 换回旧头像 `assets/images/suhan.png`，保留 28px、8px 圆角和 `-4deg` 旋转；主站 header 与 CSS Box 独立页头保持一致。
- header 改为低噪音桌面导航、主题按钮和原生 `details` 移动菜单，移除基础页面对 Bootstrap、jQuery 和 hc-mobile-nav 的运行时依赖。
- 文章页、分类页、标签页、归档页、关于页和 404 页统一到新的阅读线与卡片体系，导航支持首页分页、分类页和文章所属分类高亮。
- 文章页新增自动目录：`withToc` 过滤器读取渲染后的正文标题，给 `h1` 到 `h6` 补齐唯一 id，并在左侧生成粘性目录；移动端默认折叠在正文上方，重复标题自动追加数字后缀。
- 调整目录版式：桌面端目录贴到内容区左侧，文章阅读线保持居中；参考 beUI 和 ExpoKit 的侧栏处理，隐藏默认滚动条并改为悬浮时出现的 4px 细条，同时增加目录展开动效、目录项悬浮位移和当前章节高亮。
- 目录收起改为侧栏整列收起：正文从 880px 扩展到 1000px 并重新居中，左侧只保留贴边目录入口；收起图标改为双箭头，桌面端左右旋转、移动端上下旋转。
- 修复 Works 三个独立页面：Divergence Meter 改用绝对资源路径、预加载辉光管图片并支持手机端两行缩放；Happy New Year 移除失效的外部图片和音频，改成本地程序化烟花粒子；CSS Box 移除与新站冲突的旧全局皮肤和导航，换成轻量页头与纸墨阅读底。
- 摘要改为可选：`excerpt` 过滤器从正文第一段生成展示摘要，文章卡、RSS 和搜索索引统一使用同一兜底逻辑。
- 修复文章页 layout 缺少 `base.njk` 导致的正文片段输出、`simple-page` 标题样式误伤文章卡、归档年份间距过紧、文章卡分类链接被整卡遮罩截获等问题。
- 启用 Nunjucks `trimBlocks` 和 `lstripBlocks`，消除构建产物中的行尾空格；`package.json` 声明 `type: module`，消除 Eleventy 配置的模块类型告警。
- 验证通过：`npm run validate:content`、`npm run build`、`npm run validate:output`、`git diff --check`；Playwright 覆盖 1440px 双主题、文章页、归档页、分类页、768px 和 390px 移动端，无控制台错误和失败请求。

## 2026-11-06

### 迁移分支 `migration/eleventy-v1`

#### P0：基线与回滚边界

- 确认工作区干净，记录迁移前 HEAD `b087a02881f379331e4c64ae0e682a43eb8edf8e`。
- 创建本地备份标签 `pre-eleventy-migration`。
- 创建迁移分支 `migration/eleventy-v1`。
- 清点 13 个首页内容对象（10 个 `posts/` 内容源 + 3 个硬编码自定义页）。
- 建立 13 个旧 URL 的迁移策略表和 `views/fireworks2.html` 的待确认记录。
- 创建 [release-checklist.md](release-checklist.md)，从 P0 到 P5 的验收清单。

#### P1：内容正式化

- 九篇 Markdown 文章补齐 front matter：`title`、`date`、`slug`、`category`、`tags`、`summary`、`status`。
- `test.md` 标记为 draft。
- 英文随笔归类为 `essay` 分类。
- `关于Git使用.md` 五处 Windows 反斜杠图片路径改为站点绝对路径。
- `test.md` 图片路径从 `../images/` 改为 `/assets/images/`。
- 《白色相簿2》HTML 文章补齐 front matter，正文保持 HTML 不转 Markdown。
- 《白色相簿2》正文图片和 `../text/` 引用路径改为 `/assets/images/` 和 `/assets/text/`。

#### P2：Eleventy 骨架

- 安装 `@11ty/eleventy@^3.1.8` 为 devDependency。
- 创建 `eleventy.config.js`：输入 `src/`，输出 `site/`。
- 创建 `src/_data/site.json`、`src/content/posts/posts.11tydata.json`。
- 10 个文章源从 `posts/` 用 `git mv` 迁移到 `src/content/posts/`。
- 创建 `scripts/validate-content.mjs` 内容校验脚本。
- 复制 `css/`、`images/`、`vendor/` 到 `assets/` 对应目录。
- 复制 highlight.js 样式到 `assets/vendor/highlight-github.css`，消除对 `node_modules` 的站点引用。
- 创建 `base.njk` 和 `post.njk` 最小模板。
- `package.json` 新增 `validate:content`、`clean`、`build`、`serve` 脚本。
- 首次构建通过：10 个文章页，79 个静态资源文件。
- 创建 `.gitignore`，阻止 `node_modules/` 和 `site/` 被提交。
- 创建 `.gitattributes`，统一文本文件 LF 提交格式。
- `node_modules` 从 git 索引移除（1320 个文件），本地保留。

#### P3：页面模板与视觉迁移

- 新增 `src/index.njk` 首页模板，使用 Eleventy pagination 每页 5 篇，第 1 页输出 `/`，后续页输出 `/page/N/`。
- `eleventy.config.js` 新增 `dateDisplay` 过滤器和 `publishedPosts`、`categories`、`allTags` 三个 collection，draft 文章不进入首页集合。
- 新增 partials：`site-header.njk`、`site-footer.njk`、`sidebar.njk`、`post-card.njk`、`pagination.njk`，header 和 footer 只维护一份。
- 完善 `post.njk` 文章页 layout，渲染标题、日期、分类和正文。
- About 页迁移为 `src/content/pages/about.html`，输出 `/about/`。
- 三个自定义页迁入 `src/content/custom/`：divergence 输出 `/custom/divergence-meter/`，box 输出 `/custom/css-box/`，fireworks 输出 `/custom/happy-new-year/`。
- divergence 独立资源（样式、脚本、数字图片）迁至 `assets/custom/divergence-meter/`。
- css-box 页面的旧相对路径统一改为 `/assets/` 站点绝对路径，消除新路由下的 404。
- 复制 `js/` 到 `assets/js/`（`site.js`、`me.js`），静态资源统一由 `assets/` 提供。
- 构建通过：16 个页面 + 97 个静态资源文件。
- 过程中修复：pagination 集合引用需用 `collections.publishedPosts`；collection 不能互相引用，`categories` 和 `allTags` 用同样过滤逻辑独立派生；`layout: none` 不是合法值，自定义页不写 layout。

#### 文档

- 重写 `README.md` 为完整总资料：项目定位、快速开始、项目结构、写作流程、路由规则、构建发布和文档索引。
- 更新 `AGENTS.md`：把文档更新规则从"主动判断"改为"必须同步更新 changelog 并检查相关文档"，禁止推迟到提交确认时集中补做。

#### P4：站点能力补齐

- 新增 `/archive/` 归档页，`groupByYear` 过滤器按年份分组，published 文章按时间倒序列出。
- 新增 `/categories/{category}/` 分类页，从 categories collection 遍历生成 acgn、essay、it 三个页面。
- 新增 `/tags/{tag}/` 标签页，从 allTags collection 生成 20 个标签页面。
- 新增 `/404.html` 页面，继承站点骨架。
- 新增 `/feed.xml` RSS，9 篇 published 文章，含标题、链接、RFC 822 日期、摘要和分类。
- 新增 `/sitemap.xml`，35 个 URL，含首页、about、archive、全部分类、全部标签和文章页。
- 新增 `/data/search-index.json`，9 篇 published 文章的标题、URL、日期、分类、标签和摘要，draft 已排除。
- 文章页和聚合页加入基础 SEO：页面 title 组合站点名。
- 新增 `scripts/validate-output.mjs` 输出校验：死链、反斜杠路径、node_modules 引用、published 数量检查，`npm run validate:output` 通过。
- 过程中修复：搜索索引 JSON 被 Nunjucks 转义成 `&quot;`，用 `safe` 过滤器修复；css-box 页面引用旧 `main.js` 改为 `site.js`；删除 bootstrap-icons 演示页 `index.html`（207KB，引用不存在的演示资源，非运行所需）。
- 构建通过：44 个文件（41 个 HTML 页面），`npm run validate:content` 和 `npm run validate:output` 全部通过。
#### 架构决策

- 文章型 HTML 与独立型 HTML 的边界：按"是否需要进入文章集合"分类，不按文件扩展名分类。
- 文章型 HTML（WA2）放 `src/content/posts/`，要求完整 front matter。
- 独立特殊页（divergence、fireworks、box）放 `src/content/custom/`，不进文章集合，首页展示通过 `src/_data/custom-pages.json` 管理。
- 三个自定义页面（divergence、box、fireworks）全部保留首页展示资格。
- `site/` 构建产物本地验证用，暂不提交仓库。
