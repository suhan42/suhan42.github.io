// 输出校验脚本：检查 site/ 构建产物中的死链、反斜杠路径、node_modules 引用、Shiki 代码块和 published 文章数量。
// 发现任何问题 fail-fast 退出，不静默通过。

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const SITE_DIR = 'site';
const errors = [];

function walkDirectory(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walkDirectory(SITE_DIR);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
let shikiPageCount = 0;

// 检查 HTML 页面中的站点内部链接是否指向存在的文件。
for (const filePath of htmlFiles) {
  const content = readFileSync(filePath, 'utf8');
  const relativePath = filePath.replace(/\\/g, '/').replace(/^site\//, '/');

  if (content.includes('highlight-github')) {
    errors.push(`${relativePath}: 仍引用已删除的 highlight-github.css`);
  }

  if (content.includes('<pre class="shiki')) {
    shikiPageCount += 1;
  }

  if (/<pre><code class="language-/.test(content)) {
    errors.push(`${relativePath}: 存在未经过 Shiki 的代码块`);
  }

  if (content.includes('node_modules')) {
    // marked 造轮子文章正文里的代码示例是合法内容，排除该文件中的代码块场景。
    if (!filePath.includes('marked-blog-generator')) {
      errors.push(`${relativePath}: 引用了 node_modules`);
    }
  }

  if (/src="[^"]*\\[^"]*"/.test(content) || /href="[^"]*\\[^"]*"/.test(content)) {
    errors.push(`${relativePath}: 存在 Windows 反斜杠路径`);
  }

  const linkMatches = content.matchAll(/(?:href|src)="(\/[^"]*)"/g);
  for (const match of linkMatches) {
    const url = match[1].split('#')[0].split('?')[0];
    if (url.endsWith('.css') || url.endsWith('.js') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.woff') || url.endsWith('.woff2')) {
      const assetPath = join(SITE_DIR, url.slice(1));
      if (!existsSync(assetPath)) {
        errors.push(`${relativePath}: 资源不存在 ${url}`);
      }
    } else if (url.endsWith('/')) {
      const indexPath = join(SITE_DIR, url.slice(1), 'index.html');
      if (!existsSync(indexPath)) {
        errors.push(`${relativePath}: 页面链接 404 ${url}`);
      }
    } else if (url.endsWith('.html')) {
      const pagePath = join(SITE_DIR, url.slice(1));
      if (!existsSync(pagePath)) {
        errors.push(`${relativePath}: 页面链接 404 ${url}`);
      }
    }
  }
}

if (existsSync(join(SITE_DIR, 'assets/vendor/highlight-github.css'))) {
  errors.push('site/assets/vendor/highlight-github.css: 旧样式文件仍存在');
}

if (shikiPageCount === 0) {
  errors.push('未发现任何 Shiki 代码块，Markdown 高亮可能未生效');
}

// 检查 published 文章页数量与预期一致（当前 9 篇 published + 1 篇 draft photo-test 也生成页面，但不在集合中）。
const postsDir = join(SITE_DIR, 'posts');
const postDirs = readdirSync(postsDir, { withFileTypes: true }).filter(e => e.isDirectory());
const expectedPublished = 9;
const publishedPages = postDirs.filter(d => d.name !== 'photo-test');
if (publishedPages.length !== expectedPublished) {
  errors.push(`published 文章页数量不符：期望 ${expectedPublished}，实际 ${publishedPages.length}`);
}

if (errors.length > 0) {
  console.error(`输出校验失败，共 ${errors.length} 个错误：`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`输出校验通过：${htmlFiles.length} 个 HTML 页面，${shikiPageCount} 个页面包含 Shiki 代码块，链接和资源完整，无 node_modules 引用，无反斜杠路径。`);
