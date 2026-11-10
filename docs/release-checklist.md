# 发布验收清单

更新时间：2026-11-10

本清单服务于人工发布流程，不使用 CI/CD。P0 只建立迁移前的基线检查；P2 到 P5 的具体命令在对应阶段实现后逐步启用。每个检查项必须由人确认，不允许因为脚本通过就跳过人工验收。

## 状态约定

完成状态用 `√` 表示。未完成、待验证和待确认保留中文说明。本文件是持续维护文档，进入后续阶段时必须更新对应状态。

## 当前结论

截至 2026-11-10，迁移主链路和发布产物已落地，当前不再是“是否迁移”的阶段：

- 本地校验：`validate:content` 通过 10 个文件，`validate:output` 通过 55 个 HTML 页面。
- 发布产物：`main` 与 `origin/main` 同步，`site/` 与 `gh-pages` 树一致，`publish:pages:check` 通过。
- 线上抽查：首页、文章页、自定义页和旧 URL 返回 HTTP 200；RSS 9 条、sitemap 35 个 URL、搜索索引 9 条，draft 未进入公开索引。
- 当前剩余：人工视觉/移动端验收、日期与受控分类/标签确认、`views/fireworks2.html` 退役结论、vendor 未使用文件清理、代码高亮能力确认和提交文案。

## P0：迁移前基线

| 检查项 | 状态 | 说明 |
|---|---|---|
| P0 开始时工作区干净 | √ | 开始 P0 时 `git status --short` 为空 |
| 记录迁移前 HEAD | √ | `b087a02881f379331e4c64ae0e682a43eb8edf8e` |
| 创建本地备份标签 | √ | `pre-eleventy-migration` |
| 创建迁移分支 | √ | `migration/eleventy-v1` |
| 线上站点可达 | √ | 本次检查 `https://suhan42.github.io/` 返回 HTTP 200 |
| 清点当前首页公开内容 | √ | 基准为迁移前 13 条；当前清单见 [content-inventory.md](content-inventory.md) |
| 清点旧内容 URL | √ | 详见 [legacy-url-map.md](legacy-url-map.md) |
| 不修改生产内容 | √ | P0 只新增 `docs/` 文档，不修改 `posts/`、`htmls/`、脚本和页面 |

## P1：内容正式化

| 检查项 | 状态 | 说明 |
|---|---|---|
| 全部内容源补齐 front matter | √ | 包括 10 个 `src/content/posts/` 内容源；`npm run validate:content` 通过 |
| 13 个内容对象的日期逐项确认 | 待确认 | front matter 已有日期并在线上使用，但尚未形成“git 首次提交、正文自述、项目所有者记忆”三方一致的确认记录；禁止使用当前 `mtime` 作为证据 |
| slug 全站唯一且符合规范 | √ | 内容校验确认只允许小写英文、数字和连字符 |
| 摘要兜底策略确认 | √ | `summary` 可选，缺省时列表、RSS 和搜索索引取正文第一段 |
| 受控分类集确认 | 待确认 | 实际使用 `acgn`、`essay`、`it`，是否作为最终受控集需项目所有者确认 |
| 受控标签集确认 | 待确认 | 当前生成 20 个标签页，是否作为最终受控集需项目所有者确认 |
| 封面路径统一为 `/assets/images/...` | √ | 内容校验和输出校验均通过，无 Windows 反斜杠 |

P1 是迁移前历史阶段；旧生成链路已经在 P5 退役，不再要求在 P1 阶段验证。

## P2：Eleventy 骨架

| 检查项 | 状态 | 说明 |
|---|---|---|
| 新依赖获得确认 | √ | `@11ty/eleventy@^3.1.8` 安装为 devDependency |
| `src/` 输入目录与 `site/` 输出目录建立 | √ | 目录职责见目标架构文档 |
| 内容迁入 `src/content/posts/` | √ | 10 个文件使用 git 移动保留历史 |
| published posts collection 数量正确 | √ | 输出校验确认 9 篇 published |
| draft 不进入公开集合 | √ | `test.md` 仍生成独立页，但不进入首页、RSS、sitemap 和搜索索引 |
| 内容校验脚本可用 | √ | `npm run validate:content` 通过 10 个文件 |
| 站点资源不引用 `node_modules` | √ | highlight 样式复制到 `assets/vendor/` |
| 构建产物只在迁移分支本地验证 | √ | `npm run build` 生成 10 个文章页和静态资源 |
| `.gitignore` 建立 | √ | 阻止 `node_modules/` 被提交；`site/` 作为发布产物提交 |
| `.gitattributes` 统一文本文件 LF 提交 | √ | Markdown、HTML、JS、JSON、CSS、Nunjucks 和配置文件 |
| `node_modules` 退出 git 追踪 | √ | 1320 个文件从索引移除，本地保留；比原计划提前到 P2，因为安装后不处理会导致后续提交包含全部依赖 |

## P3：页面模板与视觉

| 检查项 | 状态 | 说明 |
|---|---|---|
| base layout 统一 HTML 骨架 | √ | head、header、footer、主题初始化和基础脚本只维护一份 |
| 首页分页正确 | √ | 第 1 页为 `/`，后续页为 `/page/N/` |
| 文章卡视觉不回退 | √ | 1440px 双主题和 390px 移动端截图验收通过 |
| Works 展示 | √ | 右侧栏三行毛玻璃索引，约 192px 高；桌面 hover 和移动端堆叠验证通过 |
| 文章页正文样式正确 | √ | 中文、代码块、表格、图片和链接在双主题下正常 |
| 文章目录自动生成 | √ | 正文标题自动补 id，重复标题追加后缀；桌面侧栏可整列收起并扩展正文到 1000px，4px 悬浮滚动条、当前章节高亮、移动端折叠和锚点跳转验证通过 |
| 移动端导航可用 | √ | 原生 details 菜单、主题按钮、外部点击和 Esc 关闭均验证通过 |
| 自定义页面资源完整 | √ | Divergence 无 404 且手机端两行显示；烟花页无外部依赖和脚本错误；CSS Box 使用独立浅色骨架 |
| 关于页迁移完成 | √ | 新阅读线和主题变量下版式正常 |
| 站内链接抽查无 404 | √ | `npm run validate:output` 通过 55 个 HTML 页面 |

## P4：站点能力

| 检查项 | 状态 | 说明 |
|---|---|---|
| 归档页生成 | √ | `/archive/` 按年份分组，2023 年 9 篇 |
| 分类页生成 | √ | `/categories/{acgn,essay,it}/` 三个页面，文章列表正确 |
| 标签页生成 | √ | `/tags/{tag}/` 20 个页面，由 collection 派生 |
| 搜索索引生成 | √ | `/data/search-index.json` 9 篇 published，draft 排除，JSON 格式有效 |
| RSS 生成 | √ | `/feed.xml` 9 条 item，RFC 822 日期 |
| sitemap 生成 | √ | `/sitemap.xml` 35 个 URL |
| 404 页面生成 | √ | `/404.html` 继承站点骨架 |
| SEO 基础字段生成 | √ | 页面 title 组合站点名；description 和 Open Graph 留到后续增强 |
| 输出校验脚本通过 | √ | `npm run validate:output` 通过 55 个 HTML 页面，链接和资源完整 |

## P5：清理与发布

| 检查项 | 状态 | 说明 |
|---|---|---|
| 旧 URL 跳转策略确认 | 部分完成 | 14 个旧路径已生成跳转页；`views/fireworks2.html` 已随 `views/` 删除，当前没有目标路由，退役或保留待确认 |
| 删除旧脚本、旧数据和旧产物 | √ | `16f781b` 已删除根目录生成脚本、`tools/`、`home_data.json` 和 `htmls/`；确认记录见 git 历史 |
| `node_modules` 退出 git 跟踪 | √ | `git ls-files node_modules` 当前为 0 |
| 未使用依赖清理 | 部分完成 | `package.json` 只保留 `@11ty/eleventy` 和 `playwright`；`assets/vendor/` 仍有 Bootstrap、hc-mobile-nav 和 jQuery 文件，基础模板未加载，是否删除待确认 |
| `.nojekyll` 存在于发布根 | √ | `gh-pages` 根目录包含 `.nojekyll`，避免非必要 Jekyll 处理 |
| GitHub Pages 发布源为 `gh-pages` 根目录 | √（建议人工复核设置页） | 线上已输出新站，`main` 根目录没有 `index.html`，说明当前不是 `main` 根目录发布；仓库内无法直接读取 Pages Source 配置 |
| `gh-pages` 不合并回 `main` | √ | 发布分支只承载静态产物，源码和构建输入仍以 `main` 为准 |
| README 更新完成 | √ | 写作流程、front matter、构建、发布和旧 URL 策略 |
| AGENTS.md 更新完成 | √ | 源目录、输出目录和人工发布边界 |
| CLAUDE.md 引用 AGENTS.md | √ | `@AGENTS.md` |
| 本地完整构建通过 | √ | 内容校验 10 个文件、输出校验 55 个 HTML 页面，构建产物与当前 `site/` 一致 |
| 发布检查脚本通过 | √ | `npm run publish:pages:check` 确认 `main`、`site/` 提交状态、必需产物和远端配置 |
| 人工抽查通过 | 部分完成 | 已做只读 HTTP 抽查；首页、文章、自定义页、旧 URL 正常；视觉、双主题、移动端和每篇文章仍需人工浏览器验收 |
| 拟提交信息已生成 | 待生成 | 文档整理完成后生成，不默认执行 commit |
| 项目所有者明确要求执行提交 | 待确认 | 只有明确要求后才运行 `git commit` |
| 合并迁移分支到 main | √ | `origin/main` 已包含迁移合并提交 |

## 发布前最终检查

每次人工发布都要按顺序执行：

```bash
git status --short
npm ci
npm run validate:content
npm run build
npm run validate:output
# 用户确认提交并推送 main 后，同步发布分支：
git push origin main
npm run publish:pages:check
npm run publish:pages
```

GitHub Pages 发布源必须是 `gh-pages` 分支的 `/ (root)`，不能指向 `main` 根目录。切换发布源后必须重新触发一次构建，确认不再出现 Jekyll 解析 `src/archive.njk` 的错误。

发布前还必须人工抽查：

1. 首页能打开，公开文章数量等于 published 数量。
2. 每篇 published 文章能从首页或归档访问。
3. draft 和测试内容不出现在首页、RSS、sitemap 和搜索索引。
4. 所有封面和正文图片加载正常。
5. 代码块样式来自 `/assets/vendor/`。
6. 重要旧 URL 跳转到新 URL。
7. 移动端导航和文章阅读体验正常。
8. 构建产物中没有 `node_modules` 引用。

## 回滚

迁移前状态固定在本地标签 `pre-eleventy-migration`，对应提交 `b087a02881f379331e4c64ae0e682a43eb8edf8e`。

发布前发现问题，切回原 `main` 或备份标签即可回滚。

发布后出现严重问题，由项目所有者人工将 `main` 回退到迁移前提交并重新推送发布。旧 URL 跳转页应尽量保留，避免外链失效。
