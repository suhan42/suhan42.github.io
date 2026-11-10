# 旧 URL 清单与迁移策略

更新时间：2026-11-10

本表记录迁移前公开站点的入口和内容页 URL，以及迁移后的实际处理结果。GitHub Pages 只能托管静态文件，不能配置 HTTP 301，因此“跳转页”指的是包含 meta refresh、canonical 和可见链接的静态页面，不承诺真实 HTTP 301。

## 清单来源

1. 迁移前 `home_data.json` 中的 10 条生成文章。
2. 迁移前 `pagination-container.js` 中硬编码的 3 条自定义内容。
3. 迁移前首页、关于页和固定导航入口。

## 内容页

| 旧 URL | 当前标题 | 迁移策略 | 目标路由 | 状态 | 备注 |
|---|---|---|---|---|---|
| `./htmls/c自查表.html` | C 自查表 | 静态跳转页 | `/posts/c-reference/` | √ | 目标与 front matter slug 一致 |
| `./htmls/Linux命令行.html` | Linux 命令行 | 静态跳转页 | `/posts/linux-command/` | √ | 目标与 front matter slug 一致 |
| `./htmls/marked造轮子.html` | marked 造轮子 | 静态跳转页 | `/posts/marked-blog-generator/` | √ | 目标与 front matter slug 一致 |
| `./htmls/MySQL自查表.html` | MySQL 自查表 | 静态跳转页 | `/posts/mysql-reference/` | √ | 目标与 front matter slug 一致 |
| `./htmls/test.html` | photo test | 静态跳转页 | `/` | √ | 文章已标记为 draft，旧页回到首页而不是公开文章页 |
| `./htmls/vi、vim.html` | vi 与 vim | 静态跳转页 | `/posts/vi-and-vim/` | √ | 目标与 front matter slug 一致 |
| `./htmls/what did you learn from your heartbreak.html` | what did you learn from your heartbreak | 静态跳转页 | `/posts/learn-from-heartbreak/` | √ | 目标与 front matter slug 一致 |
| `./htmls/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html` | 《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理] | 静态跳转页 | `/posts/wa2-playthrough-guide/` | √ | 保留文章型 HTML 正文，目标与 front matter slug 一致 |
| `./htmls/关于Git使用.html` | 关于 Git 使用 | 静态跳转页 | `/posts/about-git/` | √ | 目标与 front matter slug 一致 |
| `./htmls/静态博客框架之Hexo & Jekyll.html` | 静态博客框架之 Hexo 与 Jekyll | 静态跳转页 | `/posts/hexo-and-jekyll/` | √ | 目标与 front matter slug 一致 |
| `./views/divergence/divergence.html` | 倒计时 | 静态跳转页 | `/custom/divergence-meter/` | √ | 交互页已迁移，资源位于 `/assets/custom/divergence-meter/` |
| `./views/box.html` | 关于 css 中 box 的使用 | 静态跳转页 | `/custom/css-box/` | √ | 已迁移为独立 HTML 教学页 |
| `./views/fireworks.html` | 新年快乐！！！ | 静态跳转页 | `/custom/happy-new-year/` | √ | 已迁移为独立 HTML 烟花页 |
| `./plugins/about.html` | 关于页 | 静态跳转页 | `/about/` | √ | 已迁移为 `src/content/pages/about.html` |
| `./views/fireworks2.html` | 备用或实验 fireworks 页面 | 未建立跳转 | 无 | 待确认 | 文件已随 `views/` 删除；是否保留或退役需项目所有者明确结论 |

## 生成结果

- `scripts/generate-redirects.mjs` 当前生成 14 个跳转页，输出在 `site/htmls/`、`site/views/` 和 `site/plugins/`。
- 所有已发布文章的旧 URL 都有跳转页；`test` 旧 URL 指向首页。
- `views/fireworks2.html` 不在跳转映射中，当前只有“已删除、未建跳转”的仓库事实，没有正式退役结论。

## 目标路由约束

1. 新文章页统一使用 `/posts/{slug}/`。
2. 新自定义页统一使用 `/custom/{slug}/`。
3. `slug` 只能使用小写英文、数字和连字符。
4. 目标 URL 都是目录式路径，不以 `.html` 结尾。
5. 所有跳转页必须保留到旧路径，不依赖 JavaScript 才能访问目标内容。
6. `home_data.json` 和旧首页脚本只作为迁移前清点来源，已不再作为运行数据。

## 验收基准

1. 每个已发布旧内容 URL 都有跳转页或“明确退役”记录。
2. 每个跳转页目标都与正式 permalink 一致。
3. 不再生成指向 `node_modules` 或不存在资源的跳转页。
4. `test.md` 保持 draft，旧 URL 不进入公开文章集合。
5. `views/fireworks2.html` 有保留、删除或迁移结论。
