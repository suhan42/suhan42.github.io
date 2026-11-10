# 变更日志

最新内容放前面；同一天合并写，聚焦具体内容，不记录过多 git 操作。

## 2026-11-10

### 文档对账与当前状态收口

- 按仓库实际状态重写 `README.md` 的当前状态：迁移已完成并上线，`main` 承载源码和 `site/`，`gh-pages` 承载发布产物。
- 更新 `docs/migration-plan.md`：P5 改为收尾中，补充旧链路清理、`site/` 与 `gh-pages` 一致性、线上抽查和剩余收尾项。
- 更新 `docs/release-checklist.md`：回填旧脚本删除、`node_modules` 退出跟踪、Pages 发布行为等状态；保留日期、受控分类/标签、人工视觉验收和提交确认等未完成项。
- 重写 `docs/legacy-url-map.md`：记录 14 个已生成跳转页和 `views/fireworks2.html` 的待确认状态。
- 重写 `docs/content-inventory.md`：改为当前 `src/content/posts/` 和 `src/content/custom/` 的实际清单，历史 P0 快照只保留在 git 历史和 `pre-eleventy-migration` 标签。
- 修正 `docs/target-architecture.md`：按实际目录更新文件树、`.nojekyll` 位置、集合名称和依赖说明，移除不存在的 `.eleventyignore`、`.editorconfig` 和根目录 `.nojekyll` 描述。
- 当前验证：`validate:content` 通过 10 个文件，`validate:output` 通过 55 个 HTML 页面；`site/` 177 个跟踪文件，`gh-pages` 与 `main` 中 `site/` 子树一致。
- 当前待确认：日期和受控分类/标签的确认记录、`views/fireworks2.html` 的退役结论、vendor 未使用资源清理、代码高亮能力。

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
