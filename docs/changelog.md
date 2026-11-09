# 变更日志

最新内容放前面；同一天合并写，聚焦具体内容，不记录过多 git 操作。

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
