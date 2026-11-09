# 发布验收清单

更新时间：2026-11-06

本清单服务于人工发布流程，不使用 CI/CD。P0 只建立迁移前的基线检查；P2 到 P5 的具体命令在对应阶段实现后逐步启用。每个检查项必须由人确认，不允许因为脚本通过就跳过人工验收。

## 状态约定

完成状态用 `√` 表示。未完成、待验证和待确认保留中文说明。本文件是持续维护文档，进入后续阶段时必须更新对应状态。

## P0：迁移前基线

| 检查项 | 状态 | 说明 |
|---|---|---|
| P0 开始时工作区干净 | √ | 开始 P0 时 `git status --short` 为空 |
| 记录迁移前 HEAD | √ | `b087a02881f379331e4c64ae0e682a43eb8edf8e` |
| 创建本地备份标签 | √ | `pre-eleventy-migration` |
| 创建迁移分支 | √ | `migration/eleventy-v1` |
| 线上站点可达 | √ | 本次检查 `https://suhan42.github.io/` 返回 HTTP 200 |
| 清点当前首页公开内容 | √ | 基准为 13 条，详见 [content-inventory.md](content-inventory.md) |
| 清点旧内容 URL | √ | 详见 [legacy-url-map.md](legacy-url-map.md) |
| 不修改生产内容 | √ | P0 只新增 `docs/` 文档，不修改 `posts/`、`htmls/`、脚本和页面 |

## P1：内容正式化

| 检查项 | 状态 | 说明 |
|---|---|---|
| 全部内容源补齐 front matter | 待验证 | 包括 10 个 `posts/` 内容源；自定义页先建立等价元数据 |
| 13 个内容对象的日期逐项确认 | 待验证 | 旧数据时间只能作为线索，禁止使用当前 `mtime` |
| slug 全站唯一且符合规范 | 待验证 | 只允许小写英文、数字和连字符 |
| 正式摘要逐项确认 | 待验证 | 首页摘要只能作为初稿 |
| 受控分类集确认 | 待确认 | 当前只有候选分类 |
| 受控标签集确认 | 待确认 | 当前只有候选标签 |
| 封面路径统一为 `/assets/images/...` | 待验证 | 不允许 Windows 反斜杠 |
| 旧生成链路仍可运行 | 待验证 | P1 期间不得破坏当前站点构建 |
| 生产内容未发布 | 待验证 | P1 只在迁移分支验收 |

## P2：Eleventy 骨架

| 检查项 | 状态 | 说明 |
|---|---|---|
| 新依赖获得确认 | √ | `@11ty/eleventy@^3.1.8` 安装为 devDependency |
| `src/` 输入目录与 `site/` 输出目录建立 | √ | 目录职责见目标架构文档 |
| 内容迁入 `src/content/posts/` | √ | 10 个文件使用 git 移动保留历史 |
| published posts collection 数量正确 | 待验证 | 与 P0 基线一致 |
| draft 不进入公开集合 | 待验证 | 重点验收 `test.md` |
| 内容校验脚本可用 | √ | `npm run validate:content` 通过 10 个文件 |
| 站点资源不引用 `node_modules` | √ | highlight 样式复制到 `assets/vendor/` |
| 构建产物只在迁移分支本地验证 | √ | `npm run build` 生成 10 个文章页和静态资源 |
| `.gitignore` 建立 | √ | 阻止 `node_modules/` 和 `site/` 被提交 |
| `.gitattributes` 统一文本文件 LF 提交 | √ | Markdown、HTML、JS、JSON、CSS、Nunjucks 和配置文件 |
| `node_modules` 退出 git 追踪 | √ | 1320 个文件从索引移除，本地保留；比原计划提前到 P2，因为安装后不处理会导致后续提交包含全部依赖 |

## P3：页面模板与视觉

| 检查项 | 状态 | 说明 |
|---|---|---|
| base layout 统一 HTML 骨架 | 待验证 | head、header、footer 和基础脚本只维护一份 |
| 首页分页正确 | 待验证 | 第 1 页为 `/`，后续页为 `/page/N/` |
| 文章卡视觉不回退 | 待验证 | 封面、标题、日期、分类、标签和摘要 |
| 文章页正文样式正确 | 待验证 | 中文、代码块、表格、图片和链接 |
| 移动端导航可用 | 待验证 | 固定 header、下拉菜单和移动导航 |
| 自定义页面资源完整 | 待验证 | divergence、box、fireworks 分别验收 |
| 关于页迁移完成 | 待验证 | 版式保持，资源路径更新 |
| 站内链接抽查无 404 | 待验证 | 至少覆盖首页每张卡片和固定导航 |

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
| 输出校验脚本通过 | √ | `npm run validate:output` 41 个 HTML 页面链接和资源完整 |

## P5：清理与发布

| 检查项 | 状态 | 说明 |
|---|---|---|
| 旧 URL 跳转策略确认 | 待确认 | 每个旧链接必须有跳转或明确退役 |
| 删除旧脚本、旧数据和旧产物 | 待确认 | 逐项列出后再执行 |
| `node_modules` 退出 git 跟踪 | 待确认 | 不删除本地依赖目录 |
| 未使用依赖清理 | 待确认 | 至少复核 marked、require.js 和旧高亮引用 |
| `.nojekyll` 存在于发布根 | 待验证 | 避免非必要 Jekyll 处理 |
| README 更新完成 | 待验证 | 写作流程、front matter、构建、发布和旧 URL 策略 |
| AGENTS.md 更新完成 | 待验证 | 源目录、输出目录和人工发布边界 |
| CLAUDE.md 引用 AGENTS.md | 待验证 | `@AGENTS.md` |
| 本地完整构建通过 | 待验证 | `npm ci` 后执行内容校验、构建和输出校验 |
| 人工抽查通过 | 待验证 | 首页、每篇文章、自定义页、移动端和旧 URL |
| 拟提交信息已生成 | 待验证 | 不默认执行 commit |
| 项目所有者明确要求执行提交 | 待确认 | 只有明确要求后才运行 `git commit` |
| 合并迁移分支到 main | 待确认 | 合并后人工推送发布 |

## 发布前最终检查

每次人工发布都要按顺序执行：

```bash
git status --short
npm ci
npm run validate:content
npm run build
npm run validate:output
```

P2 完成前，上述 npm 脚本可能尚未存在；此时不得伪造通过状态，只能在对应阶段完成后更新本清单。

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
