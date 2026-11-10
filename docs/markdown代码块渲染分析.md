# Markdown 代码块渲染分析

更新时间：2026-11-10

本文分析当前博客的 Markdown 代码块高亮方案，重点是 Eleventy 3.1.8、markdown-it 14.3.3、构建期静态输出和 `night` / `paper` 双主题下的兼容性。文中的 npm 版本查询时间为 2026-11-10；GitHub API 当时被限流，版本以 npm 官方 registry 和官方文档为准。

## 结论

当前选择：**Shiki 4.6.0 直接接入 Eleventy 的 markdown-it，不安装 `@shikijs/markdown-it` 插件。**

这样做的原因是：Shiki 负责语法解析和 HTML 生成，Eleventy 继续使用自己的 markdown-it 14.3.3，只替换 `md.options.highlight`。这样可以避开 `@shikijs/markdown-it@4.6.0` 对 markdown-it 15 的依赖，也不会在构建期装入两份 markdown-it。

Shiki 4.x 要求 Node.js >=20。项目最低版本已经确定为 >=20，并同步到 `package.json`、`package-lock.json`、README 和 AGENTS.md；本机 Node.js 是 v24.22.2，可以运行 Shiki 4.6.0。

如果未来必须回退到 Node.js 18，则采用兼容方案：**Shiki 3.3.0 直接接入 markdown-it**，同样不使用 `@shikijs/markdown-it`。Shiki 3.3.0 没有声明 Node >=20 的 engines 限制，`@shikijs/markdown-it@3.3.0` 又依赖 markdown-it ^14.1.0，适合当前 Eleventy 的 markdown-it 14.3.3；这不是当前选择。

## 当前仓库现状

- Eleventy 版本是 `3.1.8`，markdown-it 实际版本是 `14.3.3`。
- `eleventy.config.js` 当前没有配置任何语法高亮器。
- `src/_includes/layouts/base.njk` 已移除 `/assets/vendor/highlight-github.css` 引用，旧样式文件也已删除；构建产物只有 `language-c`、`language-sql` 之类的 class，没有 `hljs` 标记，也没有真正的高亮 token。
- 因此当前状态是“旧样式已清理，新渲染器尚未接入”，代码块目前只有站点基础 `<pre><code>` 样式。

## 候选方案对比

| 方案 | 版本 | 构建期高亮 | 双主题 | 优点 | 代价 |
|---|---:|---:|---:|---|---|
| Shiki 直接接 markdown-it | 4.6.0 | 是 | CSS 变量 | 语法质量高、主题多、transformers 完整、零客户端高亮 | Node >=20；需要自己接 `md.options.highlight` |
| Shiki 3.x 直接接 markdown-it | 3.3.0 | 是 | CSS 变量 | 兼容 Node >=18 和 markdown-it 14 | 不是最新主版本 |
| `@shikijs/markdown-it` | 4.6.0 | 是 | CSS 变量 | 接入代码最短 | 依赖 markdown-it 15，和 Eleventy 当前版本不一致 |
| Eleventy 官方语法高亮插件 | 5.0.2 | 是 | 需要自配 CSS | 官方维护、配置最少、PrismJS 生态成熟 | 视觉和双主题控制弱于 Shiki |
| PrismJS | 1.30.0 | 取决于接入方式 | 需要自配 CSS | 插件多、资料多 | 新版语法解析和主题质感一般 |
| highlight.js | 11.12.0 | 可以构建期或客户端 | 需要自配 CSS | 老牌、语言自动识别 | 静态输出和双主题需要更多定制，不推荐新接入 |
| Expressive Code | 0.44.3 | 是，基于 Shiki | 支持 | 代码框、标题栏、行号、复制按钮完整 | 集成成本高，当前博客代码块数量不值得 |
| Typora / CodeMirror | 随编辑器 | 否，编辑器运行时 | 由编辑器主题控制 | 交互和视觉可参考 | 不能直接作为静态站点渲染器 |

## 版本问题与解决

### 问题一：Shiki 4.x 要求 Node >=20

`shiki@4.6.0`、`@shikijs/markdown-it@4.6.0` 和 `@shikijs/transformers@4.6.0` 都声明 `engines.node >=20`。当前仓库最低版本已提升到 Node.js >=20，本机实际使用 v24.22.2。

解决：

1. 已完成：项目 Node.js 最低版本调整为 `>=20`，并同步到 README、AGENTS.md 和相关文档。
2. 如果未来必须保留 Node.js 18，改用 Shiki 3.3.0；当前不采用这条回退路线。
3. 无论选哪条线，`package.json` 都使用精确版本，不直接跟随 `latest`；版本升级必须重新构建并逐篇验收代码块。

### 问题二：`@shikijs/markdown-it@4.6.0` 依赖 markdown-it 15

npm registry 显示的依赖关系如下：

| 包版本 | Shiki 依赖 | markdown-it 依赖 | Node engines |
|---|---|---|---|
| `@shikijs/markdown-it@4.6.0` | `shiki@4.6.0` | `markdown-it@^15.0.3` | `>=20` |
| `@shikijs/markdown-it@4.0.2` | `shiki@4.0.2` | `markdown-it@^14.1.1` | `>=20` |
| `@shikijs/markdown-it@3.3.0` | `shiki@3.3.0` | `markdown-it@^14.1.0` | 未声明 >=20 |

Eleventy 3.1.8 实际使用 markdown-it 14.3.3。安装 `@shikijs/markdown-it@4.6.0` 会在构建期额外带入 markdown-it 15，形成重复依赖；即使插件核心只是设置 `markdownit.options.highlight`，也不应该把版本漂移藏在插件依赖里。

解决：

- **不安装 `@shikijs/markdown-it` 插件**。
- 直接安装 `shiki@4.6.0` 和 `@shikijs/transformers@4.6.0`。
- 在 `eleventy.config.js` 中设置 Eleventy 自带 markdown-it 的 `options.highlight`。
- 如果必须使用插件，选 `@shikijs/markdown-it@4.0.2`（兼容 markdown-it 14）或 `@shikijs/markdown-it@3.3.0`（兼容 Node 18），但需要锁定版本并验收。

### 为什么不能只靠升级解决

可以升级，但要先区分升级对象：

1. **升级 markdown-it**：Eleventy 3.1.8 的依赖声明是 `markdown-it@^14.3.3`，正常的 `npm install` 不会自动升到 15。可以在 `package.json` 里用 `overrides` 强制安装 `markdown-it@15.0.3`，但这属于跨大版本覆盖依赖，不是官方推荐的稳定组合。
2. **升级 Eleventy**：当前 npm `latest` 仍是 `3.1.8`；`4.0.0-alpha.10` 是 canary，要求 Node.js >=22.15，而且它仍然依赖 `markdown-it@^14.2.0`，并不会自动解决 markdown-it 15 的问题。
3. **升级 Shiki**：Shiki 4.x 要求 Node.js >=20，和 markdown-it 版本是两条独立约束；只升级 Shiki 不能解决 `@shikijs/markdown-it@4.6.0` 对 markdown-it 15 的依赖。

markdown-it 15 的主要破坏性变化包括 `linkify-it` 升到 v6、默认不再生成 fuzzy links、包内 `markdown-it/lib/*` 子路径导出移除、`validateLink` / `normalizeLink` 等 API 位置变化。Eleventy 3 的 `Markdown.js` 目前只导入包根并使用 `set`、`disable`、`render` 等公共方法，所以技术上存在用 `overrides` 升到 15 的可能；但这必须用整站内容、链接、代码块和输出校验做回归，不能因为“能安装”就认为兼容。

当前不建议为了 Shiki 去强升 markdown-it：

- 直接接 Shiki 的 `md.options.highlight` 不依赖 markdown-it 15。
- 强升 markdown-it 会让所有 Markdown 文章共享一次跨大版本行为变化，风险面远大于高亮本身。
- 如果未来确实需要 markdown-it 15，优先等待 Eleventy 稳定版正式采用它，或在独立分支用 `overrides` 做完整回归后再合并。

### 推荐版本组合

主方案：

```json
{
  "devDependencies": {
    "@shikijs/transformers": "4.6.0",
    "shiki": "4.6.0"
  }
}
```

兼容 Node 18 的回退方案：

```json
{
  "devDependencies": {
    "@shikijs/transformers": "3.3.0",
    "shiki": "3.3.0"
  }
}
```

两条路线都不要使用 `latest` 或宽泛的 `*`。精确锁定版本后，由 `package-lock.json` 和 `npm ci` 保证构建可复现；升级 Shiki 时单独提交，并重新检查主题变量和生成 HTML。

## 接入方式

Eleventy 3.1.8 的 `eleventy.config.js` 是 ES Module，可以在配置初始化阶段创建 Shiki 高亮器，然后只接管 markdown-it 的 `highlight` 回调：

```js
import { bundledLanguages, createHighlighter } from "shiki";
import { transformerRenderLineNumber } from "@shikijs/transformers";

const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: Object.keys(bundledLanguages)
});

const loadedLanguages = new Set(highlighter.getLoadedLanguages());
const warnedLanguages = new Set();

export default function (eleventyConfig) {
  eleventyConfig.amendLibrary("md", (md) => {
    md.options.highlight = (code, lang) => {
      const requested = (lang || "text").toLowerCase();
      let language = requested;
      if (language !== "text" && !loadedLanguages.has(language)) {
        if (!warnedLanguages.has(language)) {
          console.warn(`[Shiki] 未加载语言 "${language}"，按 text 渲染。`);
          warnedLanguages.add(language);
        }
        language = "text";
      }
      return highlighter.codeToHtml(code.replace(/\n$/, ""), {
        lang: language,
        themes: {
          light: "github-light",
          dark: "github-dark"
        },
        transformers: [transformerRenderLineNumber()]
      });
    };
  });
}
```

要点：

1. 高亮器只创建一次，不能在每个代码块回调里重复 `createHighlighter`。
2. 语言集合使用 `Object.keys(bundledLanguages)`，不写死当前文章用到的 12 种语言；Shiki 新增语言时不需要改配置。
3. 未知语言回退到 `text`，并只提示一次，避免一篇文章的错别字导致整站构建失败。
4. `code.replace(/\n$/, "")` 去掉 markdown-it 传入的尾部换行，避免代码块底部多一行空白。
5. 行号由 `transformerRenderLineNumber()` 生成；如果暂时不需要，先移除这个 transformer。
6. 主题先选 `github-light` / `github-dark`，视觉稳定后再考虑 `vitesse-light` / `vitesse-dark`。

## CSS 与双主题

Shiki 的双主题输出使用 CSS 变量，例如 token 上会同时出现 light 颜色和 `--shiki-dark` 变量。页面需要根据站点主题切换变量：

```css
html[data-theme="night"] .post-body pre.shiki,
html[data-theme="night"] .post-body pre.shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

同时要处理现有 `.post-body pre` 与 Shiki 内联背景的覆盖关系。建议：

- 把代码块边框、圆角、外间距交给站点的 `.post-body pre`。
- 把 token 颜色、代码块背景交给 Shiki 主题变量。
- 旧 `assets/vendor/highlight-github.css` 已删除，不要重新复制回 `assets/vendor/`。
- 在 `paper` 主题下检查 `github-light` 的纯白背景是否和纸墨底色冲突；如果冲突，改用 `vitesse-light` 或覆盖 `--shiki-light-bg`。

## Typora 参考

Typora 官方文档说明，代码围栏使用 CodeMirror 做语法高亮，代码块主题类名是 `cm-s-inner`。CodeMirror 是编辑器内核，不是静态站点渲染器，因此不能把 Typora 的 DOM 和 CSS 直接搬到 Eleventy。

可以借鉴的视觉和交互：

- 顶部或右上角显示语言名称。
- 长行横向滚动，不强制换行；移动端再按需要允许换行。
- 行号由 transformer 生成；当前默认开启，后续按视觉验收结果决定是否改为可选或关闭。
- 复制按钮放在代码块右上角，使用原生 `navigator.clipboard`，不为此引入库。
- 背景、边框、行号和 token 颜色都使用站点主题变量，不写死浅色。

不建议照搬 Typora 的 `cm-s-inner` CSS，因为它的选择器依赖 CodeMirror 的编辑器 DOM，和 Shiki 的 `<pre class="shiki">` 输出不兼容。

## 实施与验收

建议按以下顺序落地：

1. Node.js 最低版本已确定为 `>=20`；`package.json`、`package-lock.json`、README 和 AGENTS.md 已同步。
2. 已安装精确版本依赖，更新 `package-lock.json`，未安装 `@shikijs/markdown-it`；语言集合加载 `bundledLanguages` 全集，不写死文章当前用到的语言。
3. 已在 `eleventy.config.js` 接入 `highlight`，启用 `github-light` / `github-dark` 和行号。
4. 用 `C 自查表`、`MySQL 自查表`、`关于 Git 使用`、`Linux 命令行` 四篇文章验收 C、C++、SQL、Shell 代码块；这一步仍需人工浏览器确认。
5. 检查双主题：`night` 下 token 是否可读，`paper` 下背景是否过白，行号和复制按钮是否溢出。
6. 已运行 `npm run build` 和 `npm run validate:output`，确认没有引入 `node_modules` 引用、反斜杠路径或死链。
7. 旧 `highlight-github.css` 已删除；接入 Shiki 后只保留一套 token 配色，避免两套规则并存。

当前状态：Node.js >=20、旧样式清理和 Shiki 接入已完成，构建通过；Playwright 已检查 C 自查表和 MySQL 自查表的 `night` / `paper` 双主题、行号和 390px 代码块内部滚动，人工最终确认仍待完成。MySQL 文章长 URL 造成的页面横向溢出属于既有正文问题，不在本次高亮接入范围内。

## 参考资料

- Shiki markdown-it 集成：https://shiki.style/packages/markdown-it
- Shiki 双主题：https://shiki.style/guide/dual-themes
- Shiki 性能建议：https://shiki.style/guide/best-performance
- Shiki transformers：https://shiki.style/packages/transformers
- Eleventy 官方语法高亮插件：https://www.11ty.dev/docs/plugins/syntaxhighlight/
- Typora 代码块主题说明：https://support.typora.io/Code-Block-Styles/
- Typora 代码围栏：https://support.typora.io/Code-Fences/
