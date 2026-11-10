// KaTeX 字体精简：只保留 woff2，并移除 CSS 中的 woff/ttf 回退。
// 这是面向现代浏览器的站点，减少字体文件和发布产物体积。
// 删除字体文件前必须确认 CSS 回退已全部摘除；正则格式漂移时 fail-fast 退出，避免留下指向已删字体的坏引用。
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const cssPath = "assets/vendor/katex/katex.min.css";
const fontDir = "assets/vendor/katex/fonts";
const fallbackPattern = /,url\(fonts\/[^)]+\.woff\) format\("woff"\),url\(fonts\/[^)]+\.ttf\) format\("truetype"\)/g;
const remainingPattern = /url\(fonts\/[^)]+\.(?:woff|ttf)\)/g;
const css = readFileSync(cssPath, "utf8");
const removedFallbacks = [...css.matchAll(fallbackPattern)].length;
const nextCss = css.replace(fallbackPattern, "");
const remaining = [...nextCss.matchAll(remainingPattern)].map((match) => match[0]);

if (remaining.length > 0) {
  console.error(`KaTeX 字体精简失败：CSS 仍残留 ${remaining.length} 处 woff/ttf 引用，已跳过删除字体文件。`);
  for (const ref of remaining.slice(0, 5)) console.error(`  - ${ref}`);
  process.exit(1);
}

writeFileSync(cssPath, nextCss, "utf8");

let removed = 0;
for (const file of readdirSync(fontDir)) {
  if (/\.(woff|ttf)$/i.test(file)) {
    unlinkSync(join(fontDir, file));
    removed += 1;
  }
}

console.log(`KaTeX 字体已精简：摘除 ${removedFallbacks} 处 CSS 回退，移除 ${removed} 个 woff/ttf 文件，仅保留 woff2。`);
