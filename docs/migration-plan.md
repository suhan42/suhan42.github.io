# Eleventy 迁移开发计划

更新时间：2026-11-10

本计划定义从当前自研静态博客生成器迁移到 Eleventy 的阶段、任务、验收标准、回滚边界和主要风险。原则是不推翻现有视觉，不引入 CI/CD，分阶段交付，每阶段都能本地验证；破坏性删除、依赖变更和 URL 退役必须先获得确认。

## 当前进度（给后续 AI 的交接记录）

截至 2026-11-10，`main` 已包含迁移合并提交，线上新站已生效；迁移前快照为 `pre-eleventy-migration`。当前状态：

| 阶段 | 状态 | 说明 |
|---|---|---|
| P0 基线 | √ | 备份标签 `pre-eleventy-migration`、迁移分支和清点文档已完成 |
| P1 内容正式化 | 部分完成 | 9 篇 Markdown + 1 篇文章型 HTML 全部有完整 front matter；`test.md` 为 draft；日期、分类和标签的来源确认未形成完整记录 |
| P2 Eleventy 骨架 | √ | Eleventy 3.1.8 安装、目录结构、最小模板、内容校验和首次构建通过 |
| P3 页面模板与视觉 | √ | 首页、header/footer/sidebar、分页、文章页和双主题视觉重做完成 |
| P4 站点能力 | √ | 归档、分类页、标签页、RSS、sitemap、搜索索引和输出校验完成 |
| P5 清理与发布 | 收尾中 | 旧链路已删除，`site/` 已提交，`gh-pages` 与 `site/` 树一致，线上新站已返回新路由，代码高亮已接入；待人工视觉/移动端验收、日期与受控集合确认、旧页退役结论和提交确认 |

当前剩余收尾项：

1. 人工浏览器验收首页、9 篇 published 文章、3 个自定义页、四套主题和移动端。
2. 确认 `views/fireworks2.html` 的退役或保留结论；该文件已随 `views/` 删除，当前没有跳转目标。
3. 补齐日期、受控分类和受控标签的确认记录；当前 front matter 值已在站点使用，但不能把旧数据或 `mtime` 当作确认证据。
4. 复核 `assets/vendor/` 中尚未被基础模板加载的 Bootstrap、hc-mobile-nav 和 jQuery 文件是否删除。
5. 按 [markdown代码块渲染分析.md](markdown代码块渲染分析.md) 完成 Shiki 的人工视觉确认：C、C++、SQL、Shell、四套主题、移动端和行号；Playwright 初步检查已通过。
6. 生成拟提交文案；只有项目所有者明确要求时才执行 `git commit`。

关键决策记录：

1. 文章型 HTML 与独立型 HTML 按"是否需要进入文章集合"分类，不按扩展名。
2. 三个自定义页面（divergence、box、fireworks）全部保留首页展示资格。
3. WA2 文章保留 HTML 正文格式，迁入 `src/content/posts/`。
4. `node_modules` 移出 git 追踪比原计划提前到 P2，因为安装后不处理会导致后续提交包含全部依赖。
5. `site/` 作为唯一发布目录提交到仓库，并由 `gh-pages` 分支根目录承载 GitHub Pages 发布；构建、验收和推送仍由人工执行。
6. GitHub Pages 采用 `gh-pages` 根目录作为发布源：Branch source 不支持直接选择 `site/` 子目录，GitHub Actions 违反无 CI/CD 约束，`main` 的 `/docs` 与现有文档目录冲突，根目录直出会混入源码；`gh-pages` 不合并回 `main`。

环境差异记录：

- 项目最低 Node.js 已提升到 >=20（`package.json` 的 `engines`）；本机 Node.js 为 v24.22.2，满足要求。Eleventy 3.x 本身仍支持 >=18。
- PowerShell 5.1 在当前 sandbox 下读中文文件显示乱码，是显示层问题，文件本身编码正确；用 Node 或字节级检查确认编码。

后续 AI 进入时，先读本节确认进度，再读 [changelog.md](changelog.md) 了解已完成的具体操作，不要重复已完成阶段。

## 总体路线

迁移分六个阶段推进：

```text
P0 基线与防回滚
  ↓
P1 内容正式化
  ↓
P2 Eleventy 骨架与数据迁移
  ↓
P3 页面模板与视觉迁移
  ↓
P4 站点能力补齐
  ↓
P5 清理旧链路与发布
```

P0 和 P1 不改变线上行为，是所有后续工作的前置条件。P2 和 P3 在迁移分支上并行开发，不部署。P4 只补齐最小可用站点必需的能力。P5 在人工验收后清理旧结构并发布。

## P0：建立基线与回滚边界

### 任务

1. 确认工作区干净，记录当前 `main` 提交哈希。
2. 创建本地备份标签，例如 `pre-eleventy-migration`；如需要远端保留，再人工推送该标签。
3. 创建迁移分支，例如 `migration/eleventy-v1`；后续结构性改动都在分支进行。
4. 建立旧 URL 清单，记录 `home_data.json`、`pagination-container.js` 和实际 `htmls/` 中出现的文章链接。
5. 建立内容清点表，记录每篇文章的旧文件、当前标题、可确认日期、建议 slug、分类、标签、摘要、封面和不确定项。
6. 记录当前线上首页能打开的文章数量，作为迁移后的数量基准。

### 交付物

```text
docs/release-checklist.md
docs/content-inventory.md
docs/legacy-url-map.md
```

### 验收标准

- 每篇旧内容都有清点记录。
- 每个旧 URL 都有迁移策略：新路由、跳转页或明确废弃。
- 备份标签能回到迁移前状态。
- 没有删除、重命名或修改生产内容。

### 回滚方式

P0 只增加文档和本地标签，不影响线上。出现错误时删除迁移分支，回到原 `main` 工作区。

## P1：正式化内容源

### 目标

把文章从“文件名 + 正文”升级为“front matter + 正文”的完整内容对象。此阶段仍保留旧生成链路可用。

### 任务

1. 为 `posts/*.md` 全部补充 front matter：
   - `title`
   - `date`
   - `slug`
   - `category`
   - `tags`
   - `summary`
   - `status`
2. 对旧 HTML 源文章建立等价元数据记录；能安全转换时再迁移为 Markdown，不能安全转换时先保留 HTML。
3. 根据文章正文、旧首页数据和 git 历史确认日期；无法确认的日期必须向项目所有者确认，不得默认使用当前时间。
4. 为每篇文章确定稳定的英文 slug；展示标题继续允许中文。
5. 为每篇文章写显式摘要，不再依赖生成器截取第一个段落。
6. 统一图片引用路径为站点绝对路径，消除 `.\`、`./` 和 `../`。
7. 校验 slug 全站唯一，格式只允许小写英文、数字和连字符。
8. 补齐或明确每篇文章的分类和标签。
9. 暂不删除 `posts/`、`htmls/`、`home_data.json` 和旧脚本。

### 内容字段标准

```markdown
---
title: 关于 Git 使用
date: 2023-01-23
slug: about-git
category: it
tags:
  - git
  - workflow
summary: Git 是分布式版本控制系统，适合个人与团队协作。
cover: /assets/images/git/work.png
status: published
---
```

### 验收标准

- 所有 Markdown 文章都有完整 front matter。
- 所有 slug 唯一且符合规范。
- 所有日期都是显式 ISO 日期，不使用文件修改时间。
- 所有 published 文章都有非空 summary。
- 所有站内图片路径都是 `/assets/...`，没有 Windows 反斜杠。
- 旧脚本仍能构建当前站点，线上行为不发生非必要变化。

### 风险与约束

日期是最高风险字段。旧 `home_data.json` 中的时间和文章内容可能不一致；`mtime` 已经失效，只能作为线索，不能作为结论。无法确认的日期必须停在 P1 并向项目所有者确认。

### 回滚方式

P1 修改的是内容源。若迁移中止，front matter 对旧生成器无害；可保留改造后的内容，或按备份标签恢复。

## P2：搭建 Eleventy 骨架

### 前置确认

安装 Eleventy 是一次明确的新依赖变更。执行前需要项目所有者确认以下方向：

1. 使用 npm 包 `@11ty/eleventy@^3.1.8`。
2. Eleventy 安装为 devDependency。
3. 构建输出目录命名为 `site/`。
4. 当前 Node.js `v24.22.2` 满足 Eleventy 3.x 的运行要求；Shiki 4.6 接入后项目最低版本为 >=20。

### 任务

1. 更新 `package.json`，新增 `devDependencies` 和构建脚本：
   - `validate:content`
   - `clean`
   - `build`
   - `validate:output`
   - `serve`
2. 创建 `eleventy.config.js`，设置输入目录 `src/`、输出目录 `site/`、include 目录 `src/_includes/` 和数据目录 `src/_data/`。
3. 创建 `.eleventyignore`，确保 `docs/`、`node_modules/`、旧产物和配置文件不进入模板扫描。
4. 创建 `src/_data/site.json`，维护站点标题、作者、正式 URL、语言、时区、导航、分类映射和社交链接。
5. 将已正式化的文章从 `posts/` 迁移到 `src/content/posts/`。使用 git 移动保留历史。
6. 创建目录级默认数据，让文章默认使用 post layout 和 `/posts/{slug}/` permalink。
7. 实现 draft 过滤策略：`status` 不等于 `published` 的文章不进入 published posts collection、首页、RSS、sitemap 和搜索索引。
8. 实现 `validate-content.mjs`，校验必填字段、slug 格式、slug 唯一性、date 格式、status 枚举、图片路径和重复 permalink。
9. 将站点需要的 CSS、图片、字体、vendor 样式复制或整理到 `assets/`，并配置 passthrough 到 `site/assets/`。
10. 删除旧 highlight 样式；Shiki 接入后不再复制 highlight.js 样式，也不引用 `node_modules`。
11. 输出最小文章页数据，验证 collection 数量、排序和 permalink。

### 依赖策略

Eleventy 是构建期依赖，不进入浏览器运行时。`marked` 不再进入新构建链路；在 P5 前暂不删除声明，避免影响旧脚本。`highlight.js` 继续用于代码高亮。`require.js` 若没有实际用途，在 P5 清理阶段申请删除。

### 验收标准

- `npm run validate:content` 能发现缺失字段、重复 slug、非法路径和非法日期。
- `npm run build` 能在本地生成 `site/`。
- `site/posts/{slug}/index.html` 的数量等于 published 文章数量。
- draft 文章不出现在任何公开页面或索引数据中。
- 站点输出没有任何指向 `node_modules` 的链接或样式。
- `site/assets/` 中包含构建必需资源。

### 回滚方式

P2 在迁移分支开发，不部署。构建失败时保留 `main` 不动；如源文章已移动，可按备份标签恢复目录结构。

## P3：迁移页面模板与视觉

### 目标

把重复 HTML 收敛为 Eleventy layout 和 partial，并在 2026-11-09 完成夜航/纸墨双主题视觉重做；不再保留旧 Bootstrap 皮肤作为基础站点依赖。

### 任务

1. 创建 `base.njk`，统一 HTML head、编码、viewport、站点元数据、header、footer 和基础脚本。
2. 将首页迁移为 `index.njk`，使用 Eleventy pagination。
3. 将旧首页文章卡迁移为 `post-card.njk`。
4. 将分页迁移为 `pagination.njk`，支持首页、上一页、下一页和页码状态。
5. 创建 `post.njk`，渲染标题、日期、分类、标签、正文、封面和文章导航。
6. 创建 `sidebar.njk`，分类和标签由 published collection 派生，不再硬编码。
7. 创建 `site-header.njk` 和 `site-footer.njk`，消除 `index.html`、生成脚本和 `plugins/footer.html` 的重复结构。
8. 将 `plugins/about.html` 迁移为 `src/content/pages/about.html`，改写资源路径但保持版式。
9. 处理自定义手写页面：
   - `views/divergence/` 迁到 `src/content/custom/divergence/`；
   - `views/box.html` 和 fireworks 页面按同样策略归类；
   - 明确哪些页面仍需要 jQuery，哪些可以先用原生 JS。
10. 更新所有样式和脚本引用为 `/assets/...`。
11. 文章页输出标题、日期、分类、标签、自动目录和正文阅读线，目录在桌面端吸附在左侧、移动端折叠。
12. 逐页校验 header、footer、移动导航、分页、文章样式和双主题切换。

### 模板边界

Nunjucks 自动转义所有内容变量。只有站点配置和构建器生成的受控 HTML 可以显式标记 safe。禁止继续在客户端用未转义字符串拼接文章数据。

### 验收标准

- 首页文章数量与 P0 基线一致。
- 首页按 front matter `date` 倒序排序。
- 分页首页、尾页、上一页和下一页路径正确。
- 每篇文章都有正确标题、日期、分类、标签、摘要和正文。
- 中文标题、中文正文和图片显示正常。
- 代码块高亮样式来自 `site/assets/`。
- 移动端导航可用，固定 header 和滚动行为不回退。
- 自定义页面资源不出现 404。

### 回滚方式

P3 不删除旧页面，全部输出在迁移分支的 `site/` 中。部署前只做本地和预览验证；失败时回到 `main` 或备份标签。

## P4：补齐最小站点能力

P4 不是无限扩展功能，只实现迁移后博客的基础能力。

### 任务

1. 生成归档页 `/archive/`，按年份和日期列出 published 文章。
2. 生成分类页 `/categories/{category}/`。
3. 生成标签页 `/tags/{tag}/`。
4. 生成 `/data/search-index.json`，包含标题、日期、slug、URL、分类、标签和摘要；搜索 UI 可在后续阶段实现。
5. 实现 404 页面。
6. 实现基础 SEO：
   - 唯一页面标题；
   - 文章 description；
   - canonical；
   - Open Graph 标题、描述和封面；
   - 文章发布时间。
7. 生成 RSS，URL 为 `/feed.xml`。
8. 生成 sitemap，URL 为 `/sitemap.xml`。
9. 实现 `validate-output.mjs`：
   - 检查站点内链接目标存在；
   - 检查图片引用存在；
   - 检查无 `.\` 路径；
   - 检查无 `node_modules` 引用；
   - 检查 published 文章数量；
   - 检查 RSS 和 sitemap 中的 URL 正确。

RSS 或 sitemap 如果引入官方 Eleventy 插件，需要在执行前单独确认新依赖。第一版也可以用 Nunjucks 模板直接输出 XML，避免额外依赖。

### 验收标准

- 归档、分类、标签页只包含 published 文章。
- 每个标签和分类页面路径可访问。
- RSS 和 sitemap 不包含 draft。
- 404 页面存在且继承站点骨架。
- 输出校验脚本通过。

## P5：旧链路清理与发布

P5 是唯一的大规模清理阶段。所有删除、移动退役和旧 URL 兼容策略必须在执行前逐项获得确认。

### 任务

1. 为仍有价值的旧 URL 生成静态跳转页：
   - 旧地址写入新地址的 canonical；
   - 使用 meta refresh 和可见链接兜底；
   - 生成映射文档 `docs/legacy-url-map.md`。
2. 生成并提交 `.nojekyll`。
3. 从 git 索引移除 `node_modules/`，并加入 `.gitignore`。此操作不删除本地依赖目录，但会改变 git 跟踪状态，必须先确认。
4. 清理不再需要的旧文件：
   - `PostToHtml_and_CreateHomeData.js`
   - `tools/markdown_to_html.js`
   - `tools/create_home_data_v1.js`
   - `tools/create_home_data_v2.js`
   - `tools/demo_msrked.js`
   - `pagination-container.js`
   - `home_data.json`
   - `htmls/`
   - 已迁移完成的 `posts/`
5. 清理不再使用的声明依赖：
   - `marked`
   - `require.js`
   - 其他确认无引用的依赖。
6. 合并 Bootstrap、bootstrap-icons、hc-mobile-nav、jQuery 和 highlight 样式到 `assets/vendor/`，只保留站点实际使用的文件。
7. 更新 `README.md`，说明目标架构、写作流程、front matter 字段、本地命令、构建方式、发布方式和旧 URL 策略。
8. 新增或更新 `AGENTS.md`，说明源目录、输出目录、构建边界、禁止 CI/CD 和发布产物提交规则。
9. 新增 `CLAUDE.md`，引用 `@AGENTS.md`。
10. 更新 `docs/release-checklist.md`，把发布步骤固定为人工流程。
11. 人工执行完整构建和验收清单。
12. 生成拟提交信息；只有项目所有者明确要求执行提交时才运行 `git commit`。
13. 人工将 `migration/eleventy-v1` 合并回 `main`。
14. 本地确认 `site/` 内容后推送 `main`，再由 `site/` 子树同步到 `gh-pages`，并在 Pages 设置中将发布源切换为 `gh-pages` 根目录。

### P5 执行记录（2026-11-10）

- 旧生成脚本、`tools/`、`home_data.json` 和 `htmls/` 已在 `16f781b` 清理；`node_modules` 当前 git 跟踪数量为 0。
- `main` 与 `origin/main` 同步；`site/` 当前共 239 个文件，输出 57 个 HTML 页面和 14 个旧 URL 跳转页。
- `gh-pages` 与 `main` 中 `site/` 子树一致；线上首页、文章页、自定义页和旧 URL 均返回 HTTP 200。
- GitHub Pages 设置页仍建议人工截图复核，仓库内只能验证发布产物和线上行为，不能直接读取 Pages Source 配置。
- Shiki 4.6.0 已通过 `eleventy.config.js` 直接接管 markdown-it，加载 `bundledLanguages` 全语言集；旧 `highlight-github.css` 已删除，`npm run build` 和 `npm run validate:output` 通过。

### 发布命令边界

不使用 CI/CD。发布由人工执行：

```bash
npm ci
npm run validate:content
npm run build
npm run validate:output
git status --short
```

确认 `site/` 构建产物和源变更后，再由项目所有者决定提交和推送；确认发布时同时同步 `gh-pages` 分支。

### 验收标准

- 线上首页返回 200，文章数量与本地构建一致。
- 新文章页 URL 全部使用 `/posts/{slug}/`。
- 重要旧 URL 能跳转到新 URL。
- 站点没有 `node_modules` 引用和失效资源。
- 仓库不再跟踪 `node_modules`。
- `site/` 包含最新构建产物。
- README、AGENTS.md 和发布清单与实际命令一致。
- 没有启用任何自动化流水线。

### 回滚方式

发布前，回滚到 `pre-eleventy-migration` 标签或原 `main` 即可恢复旧站点。

发布后，旧站点仍在 git 历史和备份标签中。若新站出现严重问题，可以人工回退 `main` 到旧提交并重新推送，恢复旧发布产物。旧 URL 跳转页应尽量保留，避免外链失效。

## 风险控制

| 风险 | 影响 | 控制方式 |
|---|---|---|
| 旧文章日期无法确认 | 排序、归档、RSS 和 SEO 错误 | P1 停下确认，不用当前时间兜底 |
| slug 冲突 | 文章互相覆盖或 permalink 不稳定 | 内容校验强制唯一 |
| 旧链接失效 | 外部访问、搜索索引和收藏夹失效 | 生成静态跳转页并维护映射 |
| 自定义页面迁移失败 | divergence、fireworks、box 功能丢失 | 单独归类为 custom，不强行 Markdown 化 |
| 依赖升级导致 Markdown 行为变化 | 文章渲染异常 | 新链路不迁移 marked API；用 Eleventy 默认 Markdown 体系并逐篇验收 |
| jQuery 与新模板耦合 | 新页面加载旧库或移动导航失效 | 基础骨架优先原生 JS；确需 jQuery 的 custom 页面单独声明 |
| 发布产物提交造成 diff 很大 | 审查困难 | 按阶段构建和验收，P5 清理后再合并发布 |
| 误用 CI/CD | 违反项目约束 | 所有发布命令人工执行，不添加 workflow 文件 |
| 未净化 HTML 进入模板 | 安全风险扩大 | 当前只信任本人内容；外部输入功能启用前必须先设计净化层 |

## 完成定义

迁移完成的最低标准是：

1. `src/content/posts/` 是唯一文章源。
2. 每篇文章有完整、唯一、可校验的 front matter。
3. `site/` 是唯一发布产物。
4. 首页、文章页、归档页、分类页、标签页、RSS、sitemap 和 404 均由构建生成。
5. draft 不进入公开页面和索引。
6. 旧生成脚本和重复数据文件退役。
7. `node_modules` 不进入 git。
8. 站点资源不依赖 `node_modules`。
9. 文档与实际命令一致。
10. 发布流程保持人工执行。

日常写作完成后，只需新增或修改 `src/content/posts/` 下的 Markdown，补全 front matter，执行构建和校验，再由人工确认发布。
