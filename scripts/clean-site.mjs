// 构建产物清理脚本：删除 site/ 后保留旧 URL 跳转页需要重新生成，
// 因此完整构建顺序是 clean → eleventy build → generate-redirects。

import { rmSync } from 'node:fs';

rmSync('site', { recursive: true, force: true });
console.log('site/ 已清理。');
