# 内容清点表

更新时间：2026-11-10

本文记录当前 Eleventy 内容源的实际状态。迁移前 P0 清点快照可从 `pre-eleventy-migration` 标签和 git 历史查看，不再把已删除的 `posts/`、`views/` 路径当作当前文件。

## 当前统计

| 项目 | 数量或状态 |
|---|---:|
| 文章源 | 10 |
| published 文章 | 9 |
| draft 文章 | 1（`test.md`，slug `photo-test`） |
| 受控分类（当前使用） | 3（`acgn`、`essay`、`it`） |
| 标签页 | 20 |
| 独立特殊页 | 3 |

## 文章源

下表日期是当前 front matter 的实际值，已经用于排序、归档、RSS 和 sitemap；日期的独立来源确认仍未形成完整记录，不能把旧 `home_data.json` 或文件 `mtime` 当作确认证据。

| 源文件 | 标题 | date | slug | category | tags | status |
|---|---|---|---|---|---|---|
| `src/content/posts/c自查表.md` | C 自查表 | 2023-01-22 | `c-reference` | `it` | `c`, `cpp`, `note` | published |
| `src/content/posts/Linux命令行.md` | Linux 命令行 | 2023-01-22 | `linux-command` | `it` | `linux`, `shell`, `note` | published |
| `src/content/posts/marked造轮子.md` | marked 造轮子 | 2023-01-23 | `marked-blog-generator` | `it` | `marked`, `markdown`, `static-site` | published |
| `src/content/posts/MySQL自查表.md` | MySQL 自查表 | 2023-01-22 | `mysql-reference` | `it` | `mysql`, `database`, `note` | published |
| `src/content/posts/test.md` | photo test | 2023-01-23 | `photo-test` | `it` | 无 | draft |
| `src/content/posts/vi、vim.md` | vi 与 vim | 2023-01-22 | `vi-and-vim` | `it` | `linux`, `vim`, `note` | published |
| `src/content/posts/what did you learn from your heartbreak.md` | what did you learn from your heartbreak | 2023-09-26 | `learn-from-heartbreak` | `essay` | `essay`, `english` | published |
| `src/content/posts/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html` | 《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理] | 2023-01-22 | `wa2-playthrough-guide` | `acgn` | `game`, `white-album-2`, `guide` | published |
| `src/content/posts/关于Git使用.md` | 关于 Git 使用 | 2023-01-23 | `about-git` | `it` | `git`, `workflow` | published |
| `src/content/posts/静态博客框架之Hexo & Jekyll.md` | 静态博客框架之 Hexo 与 Jekyll | 2023-01-22 | `hexo-and-jekyll` | `it` | `static-site`, `hexo`, `jekyll` | published |

## 独立特殊页

这些页面不进入文章集合，不参与文章排序、RSS 和搜索索引；首页展示元数据集中在 `src/_data/custom-pages.json`。

| 源文件 | 标题 | 路由 | 分类 | 状态 | 备注 |
|---|---|---|---|---|---|
| `src/content/custom/divergence.html` | Divergence Meter | `/custom/divergence-meter/` | `acgn` | 已迁移 | 交互页，独立资源和脚本 |
| `src/content/custom/fireworks.html` | Happy New Year | `/custom/happy-new-year/` | `acgn` | 已迁移 | 节令烟花页 |
| `src/content/custom/box.html` | CSS Box 手册 | `/custom/css-box/` | `it` | 已迁移 | 手写 HTML 教学页 |

## 待确认项

1. 日期来源：当前 front matter 日期已经生效，但缺少逐项的三方确认记录。
2. 受控分类：当前实际使用 `acgn`、`essay`、`it`，是否作为最终集合需项目所有者确认。
3. 受控标签：当前由文章标签派生 20 个标签页，是否作为最终集合需项目所有者确认。
4. `views/fireworks2.html`：迁移前未进入首页，文件已随 `views/` 删除，当前没有回退路由或退役结论。
