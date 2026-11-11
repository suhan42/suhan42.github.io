// 内容校验脚本：检查 front matter、slug 唯一性、路径规范，以及目录型子分类的一致性。
// summary 不再必填，列表摘要由模板从正文第一段自动生成；错误统一收集后 fail-fast 退出。

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontMatter } from './front-matter.mjs';
import {
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
    if (!SLUG_PATTERN.test(folder)) {
      errors.push(`${relativePath}: 子分类目录名必须是可作为 URL 的小写英文 slug "${folder}"`);
    }
    if (data.category) {
      const previousCategory = folderCategories.get(folder);
      if (previousCategory && previousCategory !== data.category) {
        errors.push(`${relativePath}: 子分类目录 "${folder}" 同时属于 ${previousCategory} 和 ${data.category}`);
      } else {
        folderCategories.set(folder, data.category);
      }
    }
  }

  if (data.cover) {
    const coverPath = parseImageReference(data.cover).path;
    const decodedCoverPath = decodeImagePath(coverPath);
    if (
      !coverPath.startsWith('/assets/images/') ||
      data.cover.includes('\\') ||
      decodedCoverPath.split('/').includes('..')
    ) {
      errors.push(`${relativePath}: cover 路径必须使用 /assets/images/...，且不能包含 .. 或反斜杠`);
    }
  }

  for (const reference of collectImageReferences(content)) {
    if (reference.includes('\\')) {
      errors.push(`${relativePath}: 图片引用禁止使用 Windows 反斜杠 "${reference}"`);
      continue;
    }
    const { path: imagePath } = parseImageReference(reference);
    if (!imagePath || isRemoteImageUrl(imagePath)) continue;
    const decodedImagePath = decodeImagePath(imagePath);
    if (decodedImagePath.includes('\\')) {
      errors.push(`${relativePath}: 图片引用禁止使用 Windows 反斜杠 "${reference}"`);
      continue;
    }
    if (
      !decodedImagePath.startsWith('/') &&
      (decodedImagePath === 'assets/images' ||
        decodedImagePath.startsWith('assets/images/') ||
        decodedImagePath.includes('/assets/images/'))
    ) {
      errors.push(`${relativePath}: 相对图片不能直接指向 assets/images，请使用 /assets/images/...`);
      continue;
    }
    if (decodedImagePath.split('/').includes('..')) {
      errors.push(`${relativePath}: 图片引用不能包含 .. 路径 "${reference}"`);
      continue;
    }
    if (decodedImagePath.startsWith('/assets/images/')) continue;
    errors.push(`${relativePath}: 图片引用必须使用 /assets/images/...，发现 "${reference}"`);
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
