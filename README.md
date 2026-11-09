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
| `src/_data/` | 站点配置 `site.json` |
| `assets/` | 站点静态资源：CSS、JS、图片、vendor 库 |
| `site/` | Eleventy 构建产物，唯一发布目录（本地验证用，不提交） |
| `docs/` | 项目文档：现状分析、目标架构、迁移计划、发布清单 |
| `scripts/` | 内容校验等构建辅助脚本 |

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
summary: 一句话摘要，用于首页卡片、RSS 和搜索。
cover: /assets/images/example.jpg   # 可选
status: published                     # 或 draft，draft 不进首页和公开索引
---
```

规则：

1. `slug` 只允许小写英文、数字和连字符，全站唯一，决定文章 URL `/posts/{slug}/`。
2. `date` 是唯一排序依据，禁止依赖文件修改时间。
3. `summary` 必填，用于首页卡片展示。
4. 站内图片引用统一写作 `/assets/images/...`，禁止 `./`、`../` 和反斜杠路径。
5. 文章型 HTML（如《白色相簿2》攻略）与 Markdown 同等对待，都放 `posts/` 且要求完整 front matter；独立交互页放 `custom/`，不进文章集合。

写完后执行：

```bash
npm run validate:content
npm run build
```

校验和构建通过后再进入发布流程。

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

构建产物 `site/` 提交到仓库，发布由人工执行，不使用 CI/CD：

```bash
npm ci
npm run validate:content
npm run build
npm run validate:output   # P4 实现后可用
git status --short        # 人工确认变更
git commit                # 仅在用户明确要求时执行
```

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
