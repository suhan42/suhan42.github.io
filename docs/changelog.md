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

#### 架构决策

- 文章型 HTML 与独立型 HTML 的边界：按"是否需要进入文章集合"分类，不按文件扩展名分类。
- 文章型 HTML（WA2）放 `src/content/posts/`，要求完整 front matter。
- 独立特殊页（divergence、fireworks、box）放 `src/content/custom/`，不进文章集合，首页展示通过 `src/_data/custom-pages.json` 管理。
- 三个自定义页面（divergence、box、fireworks）全部保留首页展示资格。
- `site/` 构建产物本地验证用，暂不提交仓库。
