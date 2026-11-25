# 构建与发布

更新时间：2026-11-19

本文是当前人工构建、验收、发布和回滚的唯一操作文档。架构边界见 [architecture.md](architecture.md)，内容清单和旧 URL 见 [content.md](content.md)，迁移阶段历史见 [archive/2026-11-migration/](archive/2026-11-migration/)。

## 基本约束

- 不使用 CI/CD，不创建 GitHub Actions 或任何自动发布流水线。
- 构建、测试、验收和发布均由人工执行。
- Node.js 最低版本为 20，依赖通过 `npm ci` 安装。
- `site/` 是唯一发布目录，`main` 保留源码和构建产物，`gh-pages` 分支根目录承载 GitHub Pages。
- 只有项目所有者明确要求时才执行 `git add` / `git commit` / 推送。

## 发布前检查

按顺序执行：

```bash
git status --short
npm ci
npm run validate:content
npm run test:first-image
npm run test:post-assets
npm run test:markdown
npm run test:image-policy
npm run test:theme
npm run assets:sync
npm run build
npm run validate:output
```

`npm run build` 的 `prebuild` 会先执行 `validate:content`，通过后才执行 `assets:sync --write`；这样内容或子分类错误不会在校验失败前先改动源图片。

## 必须人工确认

1. 首页可以打开，公开文章数量与 `validate:output` 的 published 数量一致。
2. 每篇 published 文章可以从首页、归档或分类页访问。
3. draft 和测试内容不出现在首页、RSS、sitemap 和搜索索引。
4. 首页封面、正文图片和远程图片在浏览器中实际加载，重点检查 CSDN、CNBlogs、SegmentFault 防盗链图片。
5. 四套主题 `night`、`paper`、`nocturne`、`nocturne-bright` 的正文、代码块、表格和导航可读。
6. 390px 移动端导航、文章目录、代码块横向滚动和图片缩放正常。
7. 重要旧 URL 跳转到新 URL，目标页面不是 404。
8. 构建产物不引用 `node_modules`，不包含反斜杠路径。
9. `git status` 中的源文件、图片迁移和 `site/` 变更符合预期。

## GitHub Pages 发布

发布源固定为 `gh-pages` 分支的 `/ (root)`，不能指向 `main` 根目录。发布前：

```bash
git push origin main
npm run publish:pages:check
npm run publish:pages
```

`publish:pages:check` 只检查当前分支、`site/` 提交状态、发布根目录必需文件和远端配置，不推送。`publish:pages` 只发布已经提交到当前 HEAD 的 `site/` 内容；未提交的本地构建不会自动进入发布分支。

`gh-pages` 不合并回 `main`。发布后抽查首页、文章页、分类页、标签页、旧 URL、RSS 和 sitemap。

## 回滚

- 发布前发现问题：回退工作区到上一个已验收提交，重新构建和校验。
- 发布后发现严重问题：由项目所有者人工将 `main` 回退到上一个已验收提交，重新发布 `site/`。
- 迁移前历史备份标签为 `pre-eleventy-migration`，只作为历史证据；日常回滚优先使用最近一次已验收提交。
- 旧 URL 跳转页应尽量保留，避免外链失效。

## 当前已知待办

- 分类和受控标签的最终集合仍待项目所有者确认；当前分类为 `acgn`、`essay`、`it`，标签为 18 个受控标签。
- CSDN、CNBlogs、SegmentFault 图片通过 `referrerpolicy="no-referrer"` 规避防盗链，仍依赖图床可用性；关键封面建议逐步本地化。
