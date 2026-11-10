// 输出校验脚本：检查 site/ 构建产物中的死链、反斜杠路径、node_modules 引用、Shiki 代码块和 published 文章数量。
// 发现任何问题 fail-fast 退出，不静默通过。

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { parseFrontMatter } from './front-matter.mjs';

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

// 从内容源读取 slug 和 status，输出校验不依赖写死的文章数量或 draft 文件名。
function getContentStatusSets() {
  const contentDir = 'src/content/posts';
  const contentFiles = walkDirectory(contentDir).filter(file => /\.(md|html)$/.test(file));
  const published = new Set();
  const drafts = new Set();

  for (const filePath of contentFiles) {
    const { data, error } = parseFrontMatter(readFileSync(filePath, 'utf8'));
    if (error || !data || !data.slug) continue;
    if (data.status === 'published') published.add(data.slug);
    if (data.status === 'draft') drafts.add(data.slug);
  }

  return { published, drafts };
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

  if (content.includes('katex-error')) {
    errors.push(`${relativePath}: KaTeX 公式渲染错误`);
  }

  if (/<pre><code class="language-/.test(content)) {
    errors.push(`${relativePath}: 存在未经过 Shiki 的代码块`);
  }

  if (/src="[^"]*\\[^"]*"/.test(content) || /href="[^"]*\\[^"]*"/.test(content)) {
    errors.push(`${relativePath}: 存在 Windows 反斜杠路径`);
  }

  const linkMatches = content.matchAll(/(?:href|src)="([^"]*)"/g);
  for (const match of linkMatches) {
    const rawUrl = match[1];
    if (!rawUrl || rawUrl.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(rawUrl)) continue;
    const isSiteAbsolute = rawUrl.startsWith('/');
    const isExplicitRelative = rawUrl.startsWith('./') || rawUrl.startsWith('../');
    if (!isSiteAbsolute && !isExplicitRelative) continue;

    const url = rawUrl.split('#')[0].split('?')[0];
    if (!url) continue;
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(url);
    } catch (error) {
      decodedUrl = url;
    }

    if (decodedUrl.includes('node_modules')) {
      errors.push(`${relativePath}: 引用了 node_modules`);
      continue;
    }

    const targetPath = decodedUrl.startsWith('/')
      ? join(SITE_DIR, decodedUrl.slice(1))
      : resolve(dirname(filePath), decodedUrl);
    const isDirectoryUrl = decodedUrl.endsWith('/');
    const hasFileExtension = /\.[a-z0-9]+$/i.test(decodedUrl);
    if (isDirectoryUrl || (!hasFileExtension && existsSync(join(targetPath, 'index.html')))) {
      if (!existsSync(join(targetPath, 'index.html'))) {
        errors.push(`${relativePath}: 页面链接 404 ${rawUrl}`);
      }
    } else if (!existsSync(targetPath)) {
      errors.push(`${relativePath}: 资源或页面不存在 ${rawUrl}`);
    }
  }
}

if (existsSync(join(SITE_DIR, 'assets/vendor/highlight-github.css'))) {
  errors.push('site/assets/vendor/highlight-github.css: 旧样式文件仍存在');
}

if (shikiPageCount === 0) {
  errors.push('未发现任何 Shiki 代码块，Markdown 高亮可能未生效');
}

if (!existsSync(join(SITE_DIR, 'assets/vendor/katex/katex.min.css'))) {
  errors.push('site/assets/vendor/katex/katex.min.css: KaTeX 样式缺失');
}

const katexFontsDir = join(SITE_DIR, 'assets/vendor/katex/fonts');
if (!existsSync(katexFontsDir) || readdirSync(katexFontsDir).length === 0) {
  errors.push('site/assets/vendor/katex/fonts: KaTeX 字体缺失');
}

// 检查 published 文章页与内容源一致；draft 页面可以生成，但不能混入 published 集合。
const postsDir = join(SITE_DIR, 'posts');
const postDirs = readdirSync(postsDir, { withFileTypes: true }).filter(e => e.isDirectory());
const postSlugs = new Set(postDirs.map(dir => dir.name));
const { published, drafts } = getContentStatusSets();
const missingPublished = [...published].filter(slug => !postSlugs.has(slug));
if (missingPublished.length > 0) {
  errors.push(`published 文章页缺失：${missingPublished.join(', ')}`);
}

const unknownPosts = [...postSlugs].filter(slug => !published.has(slug) && !drafts.has(slug));
if (unknownPosts.length > 0) {
  errors.push(`存在未登记状态的文章页：${unknownPosts.join(', ')}`);
}

if (errors.length > 0) {
  console.error(`输出校验失败，共 ${errors.length} 个错误：`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`输出校验通过：${htmlFiles.length} 个 HTML 页面，${published.size} 篇 published，${shikiPageCount} 个页面包含 Shiki 代码块，链接和资源完整，无 node_modules 引用，无反斜杠路径。`);
