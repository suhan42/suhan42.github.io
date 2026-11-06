# 旧 URL 清单与迁移策略

更新时间：2026-11-06

本表记录当前公开站点中需要迁移的入口和内容页 URL，并给出目标策略。P0 不创建跳转页；正式跳转页在 P5 生成和验收。任何目标路由改变都必须同步更新本文件。

## 清单来源

1. `home_data.json` 中的 10 条生成文章。
2. `pagination-container.js` 中硬编码的 3 条自定义内容。
3. 当前首页、关于页和固定导航入口。

旧路径中的中文、空格、`&`、书名号和反斜杠按原始数据保留，不做美化，便于 P5 逐项生成跳转页。

## 内容页

| 旧 URL | 当前标题 | 目标策略 | 目标候选路由 | 优先级 | 备注 |
|---|---|---|---|---|---|
| `./htmls/c自查表.html` | c自查表 | 301 语义的静态跳转页 | `/posts/c-reference/` | P1 | slug 待确认 |
| `./htmls/Linux命令行.html` | Linux命令行 | 301 语义的静态跳转页 | `/posts/linux-command/` | P1 | slug 待确认 |
| `./htmls/marked造轮子.html` | marked造轮子 | 301 语义的静态跳转页 | `/posts/marked-blog-generator/` | P1 | slug 待确认 |
| `./htmls/MySQL自查表.html` | MySQL自查表 | 301 语义的静态跳转页 | `/posts/mysql-reference/` | P1 | slug 待确认 |
| `./htmls/test.html` | test | 待定 | `/posts/photo-test/` 或移除 | P3 | 若改 draft，不建公开页；旧 URL 可指向首页并说明内容退役 |
| `./htmls/vi、vim.html` | vi、vim | 301 语义的静态跳转页 | `/posts/vi-and-vim/` | P1 | slug 待确认 |
| `./htmls/what did you learn from your heartbreak.html` | what did you learn from your heartbreak | 301 语义的静态跳转页 | `/posts/learn-from-heartbreak/` | P1 | slug 待确认 |
| `./htmls/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html` | 《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理] | 301 语义的静态跳转页 | `/posts/wa2-playthrough-guide/` | P1 | 已确认为文章型 HTML，保留正文格式迁入 posts，不转 Markdown |
| `./htmls/关于Git使用.html` | 关于Git使用 | 301 语义的静态跳转页 | `/posts/about-git/` | P1 | slug 待确认 |
| `./htmls/静态博客框架之Hexo & Jekyll.html` | 静态博客框架之Hexo & Jekyll | 301 语义的静态跳转页 | `/posts/hexo-and-jekyll/` | P1 | slug 待确认 |
| `./views/divergence/divergence.html` | 倒计时 | 保留页面，迁移后跳转 | `/custom/divergence-meter/` | P2 | 交互页和图片资源需整体迁移 |
| `./views/box.html` | 关于css中box的使用 | 保留或转换，迁移后跳转 | `/custom/css-box/` | P2 | 需确认是否保留“查看源码”的教学语义 |
| `./views/fireworks.html` | 新年快乐！！！ | 保留页面，迁移后跳转 | `/custom/happy-new-year/` | P3 | 节令页是否保留待确认 |

GitHub Pages 只能托管静态文件，不能配置 HTTP 301。因此表中“301 语义的静态跳转页”表示生成一个旧路径页面，包含 meta refresh、canonical、可见链接和跳转说明，不承诺真实 HTTP 301。

## 固定入口

| 旧 URL | 当前用途 | 目标策略 | 目标路由 |
|---|---|---|---|
| `./` | 首页 | 保留 | `/` |
| `./plugins/about.html` | 关于页 | 迁移后跳转 | `/about/` |
| `./views/fireworks2.html` | 备用或实验 fireworks 页面 | 待确认 | 暂不建立目标路由 |

`views/fireworks2.html` 未出现在当前首页数据中。P1 不迁移；进入清理阶段前需要明确保留、删除或私有展示。

## 目标路由约束

1. 新文章页统一使用 `/posts/{slug}/`。
2. 新自定义页统一使用 `/custom/{slug}/`。
3. `slug` 只能使用小写英文、数字和连字符。
4. 目标 URL 都是目录式路径，不以 `.html` 结尾。
5. 所有跳转页必须保留到旧路径，不依赖 JavaScript 才能访问目标内容。
6. `home_data.json` 和首页脚本中的旧数据只在 P0/P1 作为清点来源；迁移完成后不再作为运行数据。

## 验收基准

P0 只要求每个旧 URL 有明确策略和候选目标。P5 发布前，本表必须满足：

1. 每个已发布旧内容 URL 都有跳转页或“明确退役”记录。
2. 每个跳转页目标都与正式 permalink 一致。
3. 不再生成指向 `node_modules` 或不存在资源的跳转页。
4. `test.md` 的状态与跳转策略一致：published 有新页，draft 不进入公开集合。
5. `views/fireworks2.html` 有保留、删除或迁移结论。
