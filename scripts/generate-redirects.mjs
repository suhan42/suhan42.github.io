// 旧 URL 跳转页生成脚本：为每个旧地址生成静态跳转页，包含 meta refresh、canonical 和可见链接。
// GitHub Pages 不支持 HTTP 301，这是静态站点的标准替代方案。

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

// 旧相对路径 → 新绝对路径 映射表，与 docs/legacy-url-map.md 保持一致。
const REDIRECT_MAP = {
  'htmls/c自查表.html': '/posts/c-reference/',
  'htmls/Linux命令行.html': '/posts/linux-command/',
  'htmls/marked造轮子.html': '/posts/marked-blog-generator/',
  'htmls/MySQL自查表.html': '/posts/mysql-reference/',
  // test.md 已标记为 draft，旧地址指向首页而不是新文章页。
  'htmls/test.html': '/',
  'htmls/vi、vim.html': '/posts/vi-and-vim/',
  'htmls/what did you learn from your heartbreak.html': '/posts/learn-from-heartbreak/',
  'htmls/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html': '/posts/wa2-playthrough-guide/',
  'htmls/关于Git使用.html': '/posts/about-git/',
  'htmls/静态博客框架之Hexo & Jekyll.html': '/posts/hexo-and-jekyll/',
  'views/divergence/divergence.html': '/custom/divergence-meter/',
  'views/box.html': '/custom/css-box/',
  'views/fireworks.html': '/custom/happy-new-year/',
  'plugins/about.html': '/about/'
};

function buildRedirectHtml(oldPath, newPath) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${newPath}">
  <link rel="canonical" href="${newPath}">
  <title>页面已迁移</title>
</head>
<body>
  <p>该页面已迁移到 <a href="${newPath}">${newPath}</a>，正在自动跳转……</p>
  <p>如果没有自动跳转，请点击上方链接。</p>
</body>
</html>
`;
}

let count = 0;
for (const [oldPath, newPath] of Object.entries(REDIRECT_MAP)) {
  const outputDir = join('site', dirname(oldPath));
  const outputFile = join('site', oldPath);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, buildRedirectHtml(oldPath, newPath), 'utf8');
  count++;
}

console.log(`已生成 ${count} 个旧 URL 跳转页到 site/。`);
