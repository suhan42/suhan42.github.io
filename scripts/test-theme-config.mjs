// 主题配置一致性测试：确保 themes.json 的 theme-color 与 CSS 主题背景一致。
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const themes = JSON.parse(readFileSync("src/_data/themes.json", "utf8"));
const css = readFileSync("assets/css/themes.css", "utf8");

function readThemeBackground(themeId) {
  const pattern = new RegExp(`\\[data-theme="${themeId}"\\][^{]*\\{([^}]*)\\}`);
  const match = css.match(pattern);
  if (!match) return null;
  const background = match[1].match(/--bg\s*:\s*([^;]+);/);
  return background ? background[1].trim().toLowerCase() : null;
}

const failures = [];
for (const theme of themes) {
  const cssBackground = readThemeBackground(theme.id);
  if (!cssBackground) {
    failures.push(`${theme.id}: CSS 主题块或 --bg 缺失`);
    continue;
  }
  if (cssBackground !== theme.color.toLowerCase()) {
    failures.push(`${theme.id}: themes.json=${theme.color}，CSS --bg=${cssBackground}`);
  }
}

assert.equal(failures.length, 0, `主题配置不一致：\n${failures.join("\n")}`);
console.log(`主题配置测试通过：${themes.length} 套主题颜色一致。`);
