// 内容校验脚本：检查所有文章源文件的 front matter 完整性、slug 唯一性和路径规范。
// summary 不再必填，列表摘要由模板从正文第一段自动生成；其余必填字段缺失、slug 重复或路径非法时 fail-fast 退出。

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = 'src/content/posts';
const REQUIRED_FIELDS = ['title', 'date', 'slug', 'category', 'status'];
const STATUS_VALUES = ['published', 'draft'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;

const slugs = new Set();
const errors = [];

function parseFrontMatter(content) {
  if (!content.startsWith('---')) {
    return { data: null, error: '缺少 front matter 起始标记 ---' };
  }
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) {
    return { data: null, error: '缺少 front matter 结束标记 ---' };
  }
  const fmText = content.slice(3, endIndex).trim();
  const lines = fmText.split('\n');
  const data = {};
  let currentKey = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('- ')) {
      if (currentKey) {
        if (!Array.isArray(data[currentKey])) data[currentKey] = [];
        data[currentKey].push(trimmed.slice(2).trim());
      }
    } else if (trimmed.includes(':')) {
      const idx = trimmed.indexOf(':');
      currentKey = trimmed.slice(0, idx).trim();
      data[currentKey] = trimmed.slice(idx + 1).trim();
    }
  }
  return { data, error: null };
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

  if (data.cover && !data.cover.startsWith('/assets/images/')) {
    errors.push(`${relativePath}: cover 路径必须以 /assets/images/ 开头`);
  }
}

if (errors.length > 0) {
  console.error(`校验失败，共 ${errors.length} 个错误：`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`校验通过：${files.length} 个文件，slug 全部唯一，核心字段完整；摘要改由正文首段自动生成。`);
