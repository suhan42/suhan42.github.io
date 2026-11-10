# suhan42.github.io

网站地址：https://suhan42.github.io

基于 Eleventy 3.x 的个人静态博客，源内容以 Markdown 和文章型 HTML 为主，构建期生成纯静态页面，部署到 GitHub Pages，无后端、无 CI/CD，构建与发布均由人工执行。

## 当前状态

项目正在从旧的自研生成器迁移到 Eleventy 架构，迁移分支为 `migration/eleventy-v1`，回滚点为本地标签 `pre-eleventy-migration`。当前进度和阶段边界见 `docs/migration-plan.md`。

## 快速开始

环境要求：Node.js >= 18（本机通过 nvm 管理）。

```bash
npm ci                 # 安装依赖
npm run validate:content  # 校验文章 front matter、slug 唯一性和路径规范
npm run build          # 清理 site/ 并执行 Eleventy 构建
npm run serve          # 本地预览，默认 http://localhost:8080
```

## 项目结构

| 目录 | 职责 |
|---|---|
| `src/content/posts/` | 文章源，`.md` 和文章型 `.html`，进入文章集合 |
| `src/content/custom/` | 独立特殊页（divergence、box、fireworks），完整 HTML，不进文章集合 |
| `src/content/pages/` | About 等固定页面 |
| `src/_includes/layouts/` | 布局模板：`base.njk`、`post.njk` |
| `src/_includes/partials/` | 可复用组件：header、footer、sidebar、文章卡、分页 |
| `src/_data/` | 站点配置 `site.json` 和特殊页元数据 `custom-pages.json` |
| `assets/` | 站点静态资源：主题 CSS、主题脚本、图片和 vendor 库 |
| `site/` | Eleventy 构建产物，提交到仓库；通过 `gh-pages` 分支根目录发布 |
| `docs/` | 项目文档：现状分析、目标架构、迁移计划、发布清单 |
| `scripts/` | 内容校验、构建清理与页面发布辅助脚本 |

旧的 `posts/`、`htmls/`、`views/`、`plugins/` 目录在 P5 清理阶段确认后删除，当前仅作为迁移前快照保留。

## 写作流程

在 `src/content/posts/` 下新建 Markdown 文件，文件顶部必须包含完整 front matter：

```yaml
---
title: 文章标题
date: 2026-11-09
slug: stable-url-slug
category: it
tags:
  - example
summary: 一句话摘要，用于首页卡片、RSS 和搜索。 # 可选
cover: /assets/images/example.jpg   # 可选
status: published                     # 或 draft，draft 不进首页和公开索引
---
```

规则：

1. `slug` 只允许小写英文、数字和连字符，全站唯一，决定文章 URL `/posts/{slug}/`。
2. `date` 是唯一排序依据，禁止依赖文件修改时间。
3. `summary` 可选；缺省时列表、RSS 和搜索索引统一取正文第一段生成展示摘要，需要精确控制时再显式填写。
4. 站内图片引用统一写作 `/assets/images/...`，禁止 `./`、`../` 和反斜杠路径。
5. 文章型 HTML（如《白色相簿2》攻略）与 Markdown 同等对待，都放 `posts/` 且要求完整 front matter；独立交互页放 `custom/`，不进文章集合。

写完后执行：

```bash
npm run validate:content
npm run build
```

校验和构建通过后再进入发布流程。

## 界面主题

站点使用两套可切换主题：`night` 是夜航深色，`paper` 是纸墨浅色。`base.njk` 在首帧前恢复用户选择，没有保存值时跟随系统配色；`assets/js/theme.js` 负责按钮切换、持久化和无障碍标签更新。

页面样式集中在 `assets/css/main.css`，基础站点不再加载 Bootstrap、jQuery 和 hc-mobile-nav。移动导航使用原生 `details`，主题按钮和移动菜单都支持键盘操作。

文章页目录由正文标题自动生成，不要求手写目录数据。桌面端显示在正文左侧并随页面滚动吸附，收起后正文从 880px 扩展到 1000px；移动端折叠在正文上方。Markdown 标题和文章型 HTML 里的标题都会参与生成。

## 路由规则

| 内容类型 | 路由 |
|---|---|
| 首页第 1 页 | `/` |
| 首页第 2 页起 | `/page/N/` |
| 文章页 | `/posts/{slug}/` |
| 分类页 | `/categories/{category}/` |
| 标签页 | `/tags/{tag}/` |
| 特殊页 | `/custom/{slug}/` |
| 关于页 | `/about/` |

## 构建与发布

构建产物 `site/` 提交到仓库，GitHub Pages 发布源固定为 `gh-pages` 分支根目录；发布由人工执行，不使用 CI/CD：

```bash
npm ci
npm run validate:content
npm run build
npm run validate:output

git status --short        # 人工确认变更
git commit                # 仅在用户明确要求时执行
git push origin main      # 仅在用户明确要求时执行
npm run publish:pages:check  # 只检查，不推送
npm run publish:pages        # 将已提交的 site/ 同步到 gh-pages
```

GitHub Pages 设置固定为 `Settings → Pages → Deploy from a branch → gh-pages → / (root)`。`site/.nojekyll` 会随发布分支根目录生效并禁用 Jekyll；不要把 `main` 根目录设为 Pages 源，否则 Jekyll 会扫描 `src/` 并尝试解析 Nunjucks 模板。

### 发布口径

- `main` 是源码、配置和 `site/` 构建产物的主分支，不作为 Pages 发布源。
- `gh-pages` 是唯一 Pages 发布分支，根目录只承载 `site/` 的静态产物，不合并回 `main`。
- 构建可以在任意工作分支执行和验证，但实际发布必须以合并到 `main` 并完成验收的 `site/` 为准。
- `npm run publish:pages` 只发布已经提交的内容；未提交的本地构建不会自动进入 `gh-pages`。

完整验收清单见 `docs/release-checklist.md`。

## 文档索引

| 文档 | 内容 |
|---|---|
| `docs/current-analysis.md` | 迁移前的现状分析和框架对比证据 |
| `docs/target-architecture.md` | 目标架构唯一事实来源 |
| `docs/migration-plan.md` | 阶段任务、当前进度和回滚边界 |
| `docs/content-inventory.md` | 内容清点表和候选元数据 |
| `docs/legacy-url-map.md` | 旧 URL 清单和跳转策略 |
| `docs/release-checklist.md` | 人工发布验收清单 |
| `docs/changelog.md` | 具体变更日志 |
| `AGENTS.md` | AI/agent 行为规范 |
