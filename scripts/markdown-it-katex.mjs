// Markdown-it 的 KaTeX 数学规则，支持行内 $...$ 和块级 $$...$$。
// 公式在构建期渲染，页面运行时不加载数学库。
import katex from "katex";

function renderMath(tex, displayMode) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: "ignore",
    trust: false,
    output: "htmlAndMathml"
  });
}

// 解析块级公式，要求开始和结束标记各占一行。
function mathBlock(state, startLine, endLine, silent) {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const firstLineEnd = state.eMarks[startLine];
  if (state.src.charCodeAt(start) !== 0x24 || state.src.charCodeAt(start + 1) !== 0x24) return false;

  const firstLine = state.src.slice(start + 2, firstLineEnd);
  const sameLineEnd = firstLine.indexOf("$$");
  let content = "";
  let line = startLine;

  if (sameLineEnd !== -1) {
    content = firstLine.slice(0, sameLineEnd);
    if (firstLine.slice(sameLineEnd + 2).trim() !== "") return false;
  } else {
    content = firstLine.trimEnd() ? `${firstLine}\n` : "";
    for (line = startLine + 1; line < endLine; line += 1) {
      const lineStart = state.bMarks[line] + state.tShift[line];
      const lineEnd = state.eMarks[line];
      const text = state.src.slice(lineStart, lineEnd);
      if (text.trim() === "$$") break;
      content += `${text}\n`;
    }
    if (line >= endLine) return false;
  }

  if (!content.trim()) return false;
  if (silent) return true;

  const token = state.push("math_block", "math", 0);
  token.block = true;
  token.content = content.trim();
  token.markup = "$$";
  state.line = line + 1;
  return true;
}

// 解析行内公式，拒绝空内容、跨行内容和首尾空白。
function mathInline(state, silent) {
  const start = state.pos;
  if (state.src.charCodeAt(start) !== 0x24) return false;
  if (state.src.charCodeAt(start + 1) === 0x24) return false;
  if (start > 0 && state.src.charCodeAt(start - 1) === 0x5C) return false;

  let end = start + 1;
  while (end < state.posMax) {
    if (state.src.charCodeAt(end) === 0x24 && state.src.charCodeAt(end - 1) !== 0x5C) break;
    end += 1;
  }
  if (end >= state.posMax) return false;

  const content = state.src.slice(start + 1, end);
  if (!content || /[\r\n]/.test(content) || /^\s|\s$/.test(content)) return false;
  if (silent) return true;

  const token = state.push("math_inline", "math", 0);
  token.content = content;
  token.markup = "$";
  state.pos = end + 1;
  return true;
}

export default function markdownItKatex(md) {
  md.inline.ruler.before("emphasis", "math_inline", mathInline);
  md.block.ruler.before("paragraph", "math_block", mathBlock, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });

  md.renderer.rules.math_inline = (tokens, index) => {
    return `<span class="math math-inline">${renderMath(tokens[index].content, false)}</span>`;
  };
  md.renderer.rules.math_block = (tokens, index) => {
    return `<div class="math math-display">${renderMath(tokens[index].content, true)}</div>`;
  };
}
