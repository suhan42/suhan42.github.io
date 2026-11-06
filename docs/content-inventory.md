# 内容清点表

更新时间：2026-11-06

本表对应迁移计划 P0。它记录当前首页实际可展示的内容对象、来源、建议元数据和待确认项。所有 `建议`、`候选` 和 `待确认` 字段都不是最终结论；进入 P1 前，日期、slug、分类、标签和摘要必须逐项确认。

## 清点口径

当前首页数据由两部分拼接：

1. [PostToHtml_and_CreateHomeData.js](../PostToHtml_and_CreateHomeData.js) 根据 `posts/` 生成 `htmls/` 和 `home_data.json`。
2. [pagination-container.js](../pagination-container.js) 在脚本内硬编码 `old_data`，再把两者合并后渲染。

因此本次清点数量是 13 项，而不是只清点 `posts/` 下的 10 个源文件。

## 文章内容源

| 序号 | 源文件 | 当前标题 | 候选日期 | 候选 slug | 候选分类 | 候选标签 | 候选摘要 | 封面线索 | 状态 | 待确认 |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | `posts/c自查表.md` | c自查表 | 2023-01-22 | `c-reference` | `it` | `c`, `cpp`, `note` | 使用首页现有摘要 | 无 | published | 日期、slug、摘要是否可复用 |
| 2 | `posts/Linux命令行.md` | Linux命令行 | 2023-01-22 | `linux-command` | `it` | `linux`, `shell`, `note` | 使用首页现有摘要 | 无 | published | 日期、slug、摘要是否可复用 |
| 3 | `posts/marked造轮子.md` | marked造轮子 | 2023-01-23 | `marked-blog-generator` | `it` | `marked`, `markdown`, `static-site` | 使用首页现有摘要，建议重写为完整句 | 无 | published | 日期、slug、摘要是否可复用 |
| 4 | `posts/MySQL自查表.md` | MySQL自查表 | 2023-01-22 | `mysql-reference` | `it` | `mysql`, `database`, `note` | 首页现有摘要只有“目录”，P1 必须重写 | 无 | published | 日期、slug、正式摘要 |
| 5 | `posts/test.md` | test | 2023-01-23 | `photo-test` | 待确认 | 待确认 | `photo test`，建议迁移时重写或改 draft | `/images/gd.jpg` | draft 待确认 | 是否保留公开内容；若保留，必须补正式摘要和分类 |
| 6 | `posts/vi、vim.md` | vi、vim | 2023-01-22 | `vi-and-vim` | `it` | `linux`, `vim`, `note` | 使用首页现有摘要 | 无 | published | 日期、slug、摘要是否可复用 |
| 7 | `posts/what did you learn from your heartbreak.md` | what did you learn from your heartbreak | 2023-09-26 | `learn-from-heartbreak` | 待确认 | 待确认 | 首页摘要只有引用片段，P1 必须重写 | 无 | published 待确认 | 归入随笔、ACGN 或其他分类；确认正式摘要 |
| 8 | `posts/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html` | 《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理] | 2023-01-22 | `wa2-playthrough-guide` | `acgn` | `game`, `white-album-2`, `guide` | 使用首页现有摘要 | `/images/冬馬かずさ.jpg` | published | 已确认为文章型 HTML，保留 HTML 正文迁入 `posts/`，不转 Markdown；图片路径待改 |
| 9 | `posts/关于Git使用.md` | 关于Git使用 | 2023-01-23 | `about-git` | `it` | `git`, `workflow` | 使用首页现有摘要，建议压缩为 80 到 160 字 | `/images/git/work.png`；注意旧数据是反斜杠路径 | published | 日期、slug、摘要长度；封面路径必须改为 `/assets/images/git/work.png` |
| 10 | `posts/静态博客框架之Hexo & Jekyll.md` | 静态博客框架之Hexo & Jekyll | 2023-01-22 | `hexo-and-jekyll` | `it` | `static-site`, `hexo`, `jekyll` | 使用首页现有摘要，建议重写为完整句 | 无 | published | 日期、slug、摘要是否可复用 |

## 首页硬编码自定义内容

这些内容不是 Markdown 文章，也没有进入 `home_data.json`，只在首页脚本中拼接。

| 序号 | 页面文件 | 当前标题 | 候选日期 | 候选 slug | 候选路由 | 候选分类 | 候选标签 | 候选摘要 | 状态 | 待确认 |
|---:|---|---|---|---|---|---|---|---|---|---|
| 11 | `views/divergence/divergence.html` | 倒计时 | 2024-04-26 | `divergence-meter` | `/custom/divergence-meter/` | `acgn` | `steins-gate`, `interactive` | 一个辉光管倒计时 | published 待确认 | 交互页是否保留在首页；目录名是否直接使用 `divergence` |
| 12 | `views/box.html` | 关于css中box的使用 | 2022-04-12 | `css-box` | `/custom/css-box/` | `it` | `css`, `box-model` | 这篇不是 Markdown 笔记，是手写 HTML 教学页，建议同时查看源码。 | published 待确认 | 是否转 Markdown；手写源码展示是否是内容的一部分 |
| 13 | `views/fireworks.html` | 新年快乐！！！ | 2023-01-22 | `happy-new-year` | `/custom/happy-new-year/` | `happy` 待确认 | `fireworks`, `interactive` | 新年快乐，兔年大吉。恭喜发财，万事如意！ | published 待确认 | 节令页是否长期展示；分类 `happy` 是否保留为受控分类 |

## 字段确认规则

1. 日期：`home_data.json` 中的日期只能作为线索，不能单独作为最终发布日期。旧文件 `mtime` 已因当前检出时间失效，禁止使用。git 首次提交时间、正文自述和项目所有者记忆三方一致后才可确认。
2. slug：候选 slug 只用于避免重复命名和路由冲突，进入 P1 前必须逐项确认。确认后必须全站唯一，且只包含小写英文、数字和连字符。
3. summary：首页现有摘要可作为初稿；标记“必须重写”的条目不能直接迁移。
4. category：候选分类是迁移建议，最终受控分类集必须在 P1 确认。
5. tags：候选标签用于后续聚合页设计，不是最终标签集。
6. cover：所有封面在迁移时统一转换为 `/assets/images/...`；旧数据中的反斜杠路径不允许进入新内容。
7. status：`draft` 不进入公开集合。当前 `test.md` 明显是测试内容，默认建议改为 draft，除非项目所有者明确要保留。

## 当前基准

| 项目 | 数量或状态 |
|---|---|
| `posts/` 内容源 | 10 |
| 其中 Markdown 源 | 9 |
| 其中 HTML 源 | 1 |
| 首页硬编码自定义内容 | 3 |
| 当前首页可展示总数 | 13 |
| 已确认发布日期数量 | 0 |
| 已确认正式摘要数量 | 0 |
| 已确认最终 slug 数量 | 0 |

P1 完成时，这 13 项都必须从“候选”变为“已确认”或“明确不迁移”。
