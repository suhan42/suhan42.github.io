// 内容校验脚本：检查 front matter、slug 唯一性、路径规范，以及目录型子分类的一致性。
// summary 不再必填，列表摘要由模板从正文第一段自动生成；错误统一收集后 fail-fast 退出。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseFrontMatter } from './front-matter.mjs';
import { SUBCATEGORY_PATTERN, isInside } from './post-assets.mjs';
import {
  IMAGE_FILE_PATTERN,
  collectImageReferences,
  collectUnsupportedImageSyntax,
  decodeImagePath,
  isRemoteImageUrl,
  parseImageReference
} from './image-references.mjs';

const POSTS_DIR = 'src/content/posts';
const REQUIRED_FIELDS = ['title', 'date', 'slug', 'category', 'status'];
const STATUS_VALUES = ['published', 'draft'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;

const slugs = new Set();
const folderCategories = new Map();
const errors = [];

// 校验单张图片：站点绝对路径必须指向 /assets/images，相对路径必须指向文章目录内真实存在的图片。
function validateImageReference(reference, filePath, relativePath) {
  const { path: imagePath } = parseImageReference(reference);
  if (!imagePath || imagePath.startsWith('#') || isRemoteImageUrl(imagePath)) return;

  const decodedImagePath = decodeImagePath(imagePath);
  if (decodedImagePath.split('/').includes('..')) {
    errors.push(`${relativePath}: 图片引用不能包含 .. 路径 "${reference}"`);
    return;
  }
  if (decodedImagePath.startsWith('/assets/images/')) return;
  if (decodedImagePath.startsWith('/')) {
    errors.push(`${relativePath}: 站内图片必须使用 /assets/images/...，发现 "${reference}"`);
    return;
  }
  if (
    decodedImagePath === 'assets/images' ||
    decodedImagePath.startsWith('assets/images/') ||
    decodedImagePath.includes('/assets/images/')
  ) {
    errors.push(`${relativePath}: 相对图片不能直接指向 assets/images，请使用 /assets/images/...`);
    return;
  }
  if (!IMAGE_FILE_PATTERN.test(decodedImagePath)) {
    errors.push(`${relativePath}: 不支持的图片扩展名 "${reference}"`);
    return;
  }

  const articleDir = dirname(resolve(filePath));
  const sourcePath = resolve(articleDir, decodedImagePath);
  if (!isInside(articleDir, sourcePath)) {
    errors.push(`${relativePath}: 相对图片必须在文章目录内 "${reference}"`);
    return;
  }
  if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
    errors.push(`${relativePath}: 相对图片不存在 "${reference}"`);
  }
}

function walkDirectory(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else if (/\.(md|html)$/.test(entry.name) && !entry.name.startsWith('.')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walkDirectory(POSTS_DIR);
if (files.length === 0) {
  console.error('未找到任何文章源文件。');
  process.exit(1);
}

for (const filePath of files) {
  const relativePath = filePath.replace(/\\/g, '/');
  const content = readFileSync(filePath, 'utf8');
  const { data, error } = parseFrontMatter(content);

  if (error) {
    errors.push(`${relativePath}: ${error}`);
    continue;
  }

  const missing = REQUIRED_FIELDS.filter(field => !data[field] || data[field].length === 0);
  if (missing.length > 0) {
    errors.push(`${relativePath}: 缺少必填字段 ${missing.join(', ')}`);
  }

  if (data.slug && !SLUG_PATTERN.test(data.slug)) {
    errors.push(`${relativePath}: slug 格式非法 "${data.slug}"`);
  }

  if (data.slug && slugs.has(data.slug)) {
    errors.push(`${relativePath}: slug 重复 "${data.slug}"`);
  }
  if (data.slug) slugs.add(data.slug);

  if (data.date && !DATE_PATTERN.test(data.date)) {
    errors.push(`${relativePath}: 日期格式非法 "${data.date}"`);
  }

  if (data.status && !STATUS_VALUES.includes(data.status)) {
    errors.push(`${relativePath}: status 非法 "${data.status}"`);
  }

  if (data.category && !SLUG_PATTERN.test(data.category)) {
    errors.push(`${relativePath}: category 必须是可作为 URL 的小写英文 slug "${data.category}"`);
  }

  const relativeToPosts = relativePath.slice(`${POSTS_DIR}/`.length);
  const segments = relativeToPosts.split('/');
  if (segments.length > 2) {
    errors.push(`${relativePath}: 目录层级过深，只支持 ${POSTS_DIR}/<子分类>/<文章> 一层目录`);
  }

  if (segments.length === 2) {
    const folder = segments[0];
    // 非 slug 目录视为文章资源包，不参与分类；只有合法 slug 目录才派生分类页。
    if (SUBCATEGORY_PATTERN.test(folder) && data.category) {
      const previousCategory = folderCategories.get(folder);
      if (previousCategory && previousCategory !== data.category) {
        errors.push(`${relativePath}: 子分类目录 "${folder}" 同时属于 ${previousCategory} 和 ${data.category}`);
      } else {
        folderCategories.set(folder, data.category);
      }
    }
  }

  if (data.cover) {
    validateImageReference(data.cover, filePath, relativePath);
  }

  for (const reference of collectImageReferences(content)) {
    validateImageReference(reference, filePath, relativePath);
  }

  for (const issue of collectUnsupportedImageSyntax(content)) {
    errors.push(`${relativePath}: ${issue}`);
  }
}

if (errors.length > 0) {
  console.error(`校验失败，共 ${errors.length} 个错误：`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`校验通过：${files.length} 个文件，slug 全部唯一，核心字段完整；子分类目录与父分类一致。`);
