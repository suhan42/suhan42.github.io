# Eleventy 目标架构

更新时间：2026-11-09

本文定义迁移完成后的规范文件树、目录职责、内容数据模型、模板体系、构建输出、路由规则和 GitHub Pages 发布边界。它描述目标状态；阶段任务、删除顺序和回滚边界见 [migration-plan.md](migration-plan.md)。

## 架构原则

源内容、模板、静态资产、构建配置和发布产物分层清晰。Eleventy 只负责构建期静态生成，不在客户端运行，也不引入客户端框架。发布产物提交到仓库；构建、验收和发布由人工执行，不使用 CI/CD 自动化。

文章的唯一可信来源是 Markdown 和 front matter。展示标题、URL slug、发布时间、分类、标签和发布状态不得依赖文件系统时间或生成器猜测。`summary` 可选；缺省时模板从正文第一段提取展示摘要，只用于列表、RSS 和搜索索引的展示层，不写回内容源。模板只消费数据，不在模板里硬编码文章列表。

`site/` 是唯一发布目录。除 `docs/`、配置文件、源码和静态资产外，仓库根目录不应继续维护旧的生成页面或重复数据文件。

## 目标文件树

```text
suhan42.github.io/
├─ docs/
│  ├─ current-analysis.md
│  ├─ target-architecture.md
│  ├─ migration-plan.md
│  └─ release-checklist.md
│
├─ assets/
│  ├─ css/
│  │  ├─ main.css
│  │  ├─ variables.css
│  │  ├─ me.css
│  │  ├─ change_colour.css
│  │  └─ box.css
│  ├─ js/
│  │  ├─ site.js
│  │  ├─ theme.js
│  │  └─ me.js
│  ├─ images/
│  └─ vendor/
│     ├─ bootstrap/
│     ├─ bootstrap-icons/
│     ├─ hc-mobile-nav/
│     ├─ jquery/
│     └─ highlight-github.css
│
├─ scripts/
│  ├─ validate-content.mjs
│  ├─ validate-output.mjs
│  └─ clean-site.mjs
│
├─ src/
│  ├─ _data/
│  │  ├─ site.json
│  │  └─ custom-pages.json
│  │
│  ├─ _includes/
│  │  ├─ layouts/
│  │  │  ├─ base.njk
│  │  │  └─ post.njk
│  │  └─ partials/
│  │     ├─ site-header.njk
│  │     ├─ site-footer.njk
│  │     ├─ sidebar.njk
│  │     ├─ post-card.njk
│  │     └─ pagination.njk
│  │
│  ├─ content/
│  │  ├─ posts/
│  │  │  ├─ posts.11tydata.json
│  │  │  ├─ 2023-01-22-linux-command.md
│  │  │  ├─ 2023-01-22-c-reference.md
│  │  │  ├─ 2023-01-23-marked-ruouzi.md
│  │  │  ├─ 2023-09-26-heartbreak.md
│  │  │  └─ 2023-01-22-wa2-playthrough-guide.html
│  │  ├─ pages/
│  │  │  └─ about.html
│  │  └─ custom/
│  │     ├─ divergence.html
│  │     ├─ box.html
│  │     └─ fireworks.html
│  │
│  ├─ index.njk
│  ├─ archive.njk
│  ├─ 404.njk
│  ├─ tag.njk
│  ├─ category.njk
│  ├─ feed.njk
│  ├─ sitemap.njk
│  └─ search-index.njk
│
├─ site/
│  ├─ index.html
│  ├─ posts/
│  │  └─ marked-ruouzi/
│  │     └─ index.html
│  ├─ tags/
│  ├─ categories/
│  ├─ archive/
│  ├─ assets/
│  ├─ data/
│  ├─ feed.xml
│  ├─ sitemap.xml
│  └─ 404.html
│
├─ .editorconfig
├─ .eleventyignore
├─ .gitattributes
├─ .gitignore
├─ .nojekyll
├─ eleventy.config.js
├─ package.json
├─ package-lock.json
├─ AGENTS.md
├─ CLAUDE.md
└─ README.md
```

`src/` 是 Eleventy 输入根目录，`site/` 是输出根目录。根目录 `assets/` 通过 passthrough copy 输出到 `site/assets/`。这样模板、内容和站点资源分层明确，构建器不会扫描整份仓库文档或历史产物。

## Eleventy 配置边界

`eleventy.config.js` 只负责注册构建规则，不承载业务内容：

```js
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: "assets" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}
```

`.eleventyignore` 用于排除不需要进入构建的遗留文件。因为输入目录是 `src/`，根目录的 `docs/`、`node_modules/` 和旧构建脚本天然不参与模板扫描。

Eleventy 的文章集合通过 `addCollection("posts")` 从 `src/content/posts/*.md` 构建，按 `date` 倒序排序，只保留 `status === "published"` 的文章。分类和标签聚合页从这个集合重新派生，不依赖 Eleventy 的 `tags` 概念充当业务分类。

代码高亮继续复用已有 highlight.js 依赖，在 Eleventy 的 Markdown 渲染配置中接入。高亮样式复制到 `assets/vendor/highlight-github.css`，页面只引用输出后的站点路径，不引用 `node_modules`。

## 内容模型

每篇文章必须使用 UTF-8 无 BOM 编码，并包含完整 front matter：

```markdown
---
title: marked 造轮子
date: 2023-01-23
slug: marked-ruouzi
category: it
tags:
  - marked
  - markdown
summary: 用 marked 写一个小型静态博客生成器。
cover: /assets/images/gd.jpg
status: published
---

正文从这里开始。
```

| 字段 | 必填 | 类型或约束 | 说明 |
|---|---:|---|---|
| `title` | 是 | 非空字符串 | 页面和列表展示标题，允许中文、书名号和空格 |
| `date` | 是 | ISO 日期或日期时间 | 发布或写作时间，是唯一排序依据 |
| `slug` | 是 | `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` | URL 标识，全站唯一 |
| `category` | 是 | 小写英文或受控映射键 | 一个文章只属于一个主分类 |
| `tags` | 否 | 字符串数组 | 小写标签，用于跨主题聚合 |
| `summary` | 否 | 非空字符串 | 首页、RSS 和搜索摘要；缺省时由正文第一段生成展示摘要 |
| `cover` | 否 | 站点绝对路径 | 首页封面；无封面时模板渲染文字卡 |
| `status` | 是 | `published` 或 `draft` | 非 published 文章不进入首页、集合、RSS 和搜索索引 |

站点内图片引用统一写作 `/assets/images/...`。不能在 Markdown 中使用 `./`、`../` 或 Windows 反斜杠路径。外部图片应显式使用完整 HTTPS URL；迁移时优先把本站文章使用的图片收入 `assets/images/`。

### 文章型 HTML 与独立型 HTML 的边界

内容按“是否需要进入文章集合”而不是“文件扩展名”分类。

`src/content/posts/` 存放文章型内容，扩展名可以是 `.md` 或 `.html`。文章型 HTML 必须包含与 Markdown 文章相同的完整 front matter，正文部分保持原始 HTML 不转 Markdown；它进入 posts collection、按 date 参与排序，并出现在首页、归档、搜索索引和 RSS 中。典型例子是《白色相簿2》攻略整理，它本质是一篇文章，只是正文是 HTML。

`src/content/custom/` 存放独立型 HTML 页面，这些页面有完整的文档结构、独立脚本或独立交互逻辑，不套用文章 layout，不进入 posts collection。典型例子是 divergence 倒计时、fireworks 和 box 教学页。这类页面如果需要在首页展示，由 `src/_data/custom-pages.json` 维护受控元数据，由首页模板统一渲染，不允许在客户端硬编码文章列表。

这个边界解决了两类内容的职责冲突：文章型 HTML 需要博客的聚合能力，独立型 HTML 需要脱离博客模板的自由度。两者混在一个集合里会互相约束。

自定义手写页面放入 `src/content/custom/`，只用于无法直接 Markdown 化的交互页面，例如 divergence。这类页面必须声明独立 layout 和资源路径，不进入文章集合。

## 模板架构

模板使用 Nunjucks。`base.njk` 是唯一 HTML 骨架来源，负责 `<!DOCTYPE html>`、编码、viewport、站点名、页面标题、description、主题初始化、样式表、header、footer 和基础脚本。其他 layout 或页面只填充内容区。

```text
base.njk
├─ partials/site-header.njk
├─ layout content area
│  ├─ index.njk / post.njk / category.njk / tag.njk / archive.njk / 404.njk
│  ├─ partials/post-card.njk
│  ├─ partials/pagination.njk
│  └─ partials/sidebar.njk
└─ partials/site-footer.njk
```

`index.njk` 使用 Eleventy pagination，每页显示五篇 published 文章。第 1 页输出 `/`，后续页输出 `/page/2/`、`/page/3/`。`post.njk` 通过 `posts.11tydata.json` 应用，输出标题、日期、分类、标签、可收起的自动目录和正文阅读线；桌面端收起目录后正文从 880px 扩展到 1000px。`category.njk` 与 `tag.njk` 分别生成分类页和标签页，`archive.njk` 按年份归档，`404.njk` 输出站点骨架下的错误页。

首页主内容以 hero 和 Latest 两个分区组织，Works 移入右侧栏做紧凑索引。特殊页数据来自 `custom-pages.json`，文章数据来自 `collections.publishedPosts`，home 与侧栏不硬编码内容：

```text
┌──────────────────────────────────────────────────────┐
│ Suhan                          Home IT ACGN About  ◐ │
├───────────────────────────────────────────┬──────────┤
│ 夜里读书，纸上写笔记，偶尔做一点小作品。       │ Works    │
│ 这里是 suhan 的个人博客……                     │ DM/NY/BX │
│                                           │          │
│ Latest                                    │ Categories│
│ ┌───────────────────────────────────────┐ │          │
│ │ 2023-09-26 · essay  文章标题            │ │          │
│ │ 摘要文本……                              │ │          │
│ └───────────────────────────────────────┘ │          │
│ [1] [2]                              Next │ Tags     │
└───────────────────────────────────────────┴──────────┘
```

文章页保持约 880px 的单一阅读线，不叠加侧栏：

```text
┌────────────────────────────────────────────┐
│ Suhan                         Home IT ACGN About ◐ │
├────────────────────────────────────────────┤
│ 目录           │ marked 造轮子                │
│ 什么是 Git      │ 2023-01-23 · it · marked   │
│ 工作原理        │                             │
│ 常用操作        │ 正文......                   │
│                │                             │
│ 粘性目录        │ 单一阅读线                   │
└────────────────────────────────────────────┘
```

主题初始化内联在 `base.njk` 的 head 中，避免首帧闪白或闪黑；`assets/js/theme.js` 只负责用户切换、持久化、系统偏好变化和按钮标签更新。header 在桌面端使用完整导航，移动端使用原生 `details` 折叠菜单，不引第三方菜单库。

模板中输出标题、摘要、标签、图片地址和 URL 时必须使用 Nunjucks 自动转义。只有站点配置和受控生成 HTML 允许使用 safe 过滤器。

## 输出路由

| 页面 | URL |
|---|---|
| 首页第 1 页 | `/` |
| 首页第 2 页及以后 | `/page/2/` |
| 文章页 | `/posts/{slug}/` |
| 分类页 | `/categories/{category}/` |
| 标签页 | `/tags/{tag}/` |
| 归档页 | `/archive/` |
| 关于页 | `/about/` |
| 自定义页 | `/custom/{name}/` |
| RSS | `/feed.xml` |
| sitemap | `/sitemap.xml` |
| 搜索索引 | `/data/search-index.json` |

文章永久链接只使用 front matter 的 `slug`。旧文件名不再参与新路由。迁移上线后为仍有价值的旧路径生成静态跳转页，目标使用新 URL。

## 构建输出与发布

`site/` 是唯一提交到 git 的构建产物。目录应包含构建出的 HTML、XML、JSON、复制后的静态资源、`.nojekyll` 和为旧 URL 生成的跳转页。GitHub Pages 从 `main` 分支根目录发布，所以 `site/` 不能通过项目站点子路径访问，而是用户主站点根目录的组成部分。

标准命令设计如下：

```bash
npm ci
npm run validate:content
npm run build
npm run validate:output
```

`validate:content` 校验 front matter、必填字段、slug 唯一性、日期格式、图片路径和状态枚举。`build` 先清理 `site/`，再执行 Eleventy 构建。`validate:output` 检查输出文件、失效链接、反斜杠路径、对 `node_modules` 的引用和 published 文章数量。

`clean-site.mjs` 使用 Node.js 标准库清理 `site/`，不使用跨平台含义不稳定的 shell 删除命令。所有脚本必须有中文注释，错误直接 fail-fast，不静默继续。

## Git 与依赖策略

`node_modules/` 必须从 git 索引移除并加入 `.gitignore`。依赖通过 `package.json` 和 `package-lock.json` 固定，发布前由人工执行 `npm ci`。构建期依赖使用 devDependencies；站点只复制必要的 CSS、字体、图片和脚本到 `assets/vendor/`。

`assets/` 存放站点实际需要的静态资源。Bootstrap、bootstrap-icons、hc-mobile-nav、jQuery 和 highlight 样式只保留发布需要的文件。旧生成脚本、旧 `htmls/`、重复 `home_data.json` 和不再使用的 `require.js` 在迁移完成并确认后删除。

`.editorconfig`、`.gitattributes` 和 `.gitignore` 统一 UTF-8、LF 提交和忽略规则。新文件禁止 BOM。文档、注释和提交信息使用中文。

## 非功能要求

### 无障碍与语义

页面使用语义化标题层级；文章标题是 `h1`，列表标题不抢占 `h1`。图片必须有描述性 `alt`。交互控件必须可键盘访问，主题按钮、移动菜单和跳转主内容都提供可见焦点或明确状态。颜色对比使用 `night` 和 `paper` 两套主题变量统一维护，正文和控件文字保持足够对比度。

### 性能

第一版不引入打包器。CSS 和 JS 使用明确文件名与加载顺序；页面级脚本放在需要的 layout 中。图片必须提供有效宽高或使用现有样式约束，避免布局偏移。搜索索引只包含标题、摘要、标签和正文纯文本，不复制完整 HTML。

### SEO 与元数据

每页输出唯一 title 和 description。文章页输出 canonical、Open Graph 基础字段、发表时间和标签。站点输出 RSS 和 sitemap。草稿不出现在任何公开索引中。

### 安全

新站点默认只信任本人维护的内容。任何外部输入、评论、自动抓取或投稿功能必须先引入净化层，再进入模板。客户端代码不得把未转义数据写入 `innerHTML`。

## 发布后边界

迁移完成后的旧职责如下：`posts/` 移入 `src/content/posts/`；`htmls/` 删除或只保留旧 URL 跳转页；`home_data.json` 由 Eleventy collection 和模板替代；`pagination-container.js` 由 Eleventy pagination 替代；`PostToHtml_and_CreateHomeData.js` 和 `tools/` 下的历史转换脚本退役；`marked` 不再作为站点构建依赖。
