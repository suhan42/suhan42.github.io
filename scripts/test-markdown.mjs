// Markdown 规则回归测试：覆盖项目自定义规则和代码保护边界。
import assert from "node:assert/strict";
import MarkdownIt from "markdown-it";
import markPlugin from "./markdown-it-mark.mjs";
import markdownItKatex from "./markdown-it-katex.mjs";
import markdownItSubSup from "./markdown-it-subsup.mjs";
import markdownItGithubAlerts from "./markdown-it-github-alerts.mjs";

const md = MarkdownIt({ html: true })
  .use(markPlugin)
  .use(markdownItKatex)
  .use(markdownItSubSup)
  .use(markdownItGithubAlerts);

const tick = String.fromCharCode(96);
const cases = [
  ["行内高亮", "==高亮==", ["<mark>高亮</mark>"], []],
  ["高亮嵌套强调", "==a **b**==", ["<mark>a <strong>b</strong></mark>"], []],
  ["普通比较不误判", "a == b == c", ["a == b == c"], ["<mark>"]],
  ["行内数学", "示例：$x^2$", ['class="math math-inline"', "application/x-tex"], []],
  ["块级数学", "$$\n\\Gamma(z)=1\n$$", ['class="math math-display"', "application/x-tex"], []],
  ["下标", "H~2~O", ["H<sub>2</sub>O"], []],
  ["上标", "y^2^=4", ["y<sup>2</sup>=4"], []],
  ["删除线", "~~删除线~~", ["<s>删除线</s>"], []],
  ["行内代码保护", `${tick}H~2~O $x$ ==y==${tick}`, [`<code>H~2~O $x$ ==y==</code>`], ["<sub>", "math math-inline", "<mark>"]],
  ["代码块保护", "```text\nH~2~O $x$ ==y==\n```", ["H~2~O $x$ ==y=="], ["<sub>", "math math-inline", "<mark>"]],
  ["Callout 转 token", "> [!NOTE]\n> **正文**", ['class="callout callout-note"', 'data-callout-label="Note"', "<strong>正文</strong>"], ["[!NOTE]"]],
  ["Callout 五种类型", "> [!TIP]\n> Tip\n\n> [!IMPORTANT]\n> Important\n\n> [!WARNING]\n> Warning\n\n> [!CAUTION]\n> Caution", ["callout-tip", "callout-important", "callout-warning", "callout-caution"], ["[!TIP]", "[!IMPORTANT]"]]
];

let failed = 0;
for (const [name, source, includes, excludes] of cases) {
  const html = md.render(source);
  const problems = [];
  for (const value of includes) {
    if (!html.includes(value)) problems.push(`缺少 ${value}`);
  }
  for (const value of excludes) {
    if (html.includes(value)) problems.push(`不应出现 ${value}`);
  }
  if (problems.length > 0) {
    failed += 1;
    console.error(`FAIL ${name}: ${problems.join("；")}`);
  } else {
    console.log(`PASS ${name}`);
  }
}

assert.equal(failed, 0, `Markdown 规则测试失败 ${failed} 项`);
console.log(`Markdown 规则测试通过：${cases.length} 项。`);
