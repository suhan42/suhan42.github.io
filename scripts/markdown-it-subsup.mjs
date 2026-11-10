// Markdown-it 的 Typora 上下标规则：H~2~O 和 y^2^=4。
// 单字符 ~ 表示下标，单字符 ^ 表示上标；双 ~ 继续交给删除线规则。
function findClosing(state, start, marker) {
  let pos = start + 1;
  while (pos < state.posMax) {
    const code = state.src.charCodeAt(pos);
    if (code === marker && state.src.charCodeAt(pos - 1) !== 0x5C) {
      if (marker === 0x7E) {
        const previous = state.src.charCodeAt(pos - 1);
        const next = state.src.charCodeAt(pos + 1);
        if (previous === 0x7E || next === 0x7E) {
          pos += 1;
          continue;
        }
      }
      return pos;
    }
    pos += 1;
  }
  return -1;
}

function createRule(marker, type) {
  return function tokenize(state, silent) {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== marker) return false;
    if (marker === 0x7E && state.src.charCodeAt(start + 1) === 0x7E) return false;
    if (start > 0 && state.src.charCodeAt(start - 1) === marker) return false;

    const end = findClosing(state, start, marker);
    if (end < 0) return false;
    const content = state.src.slice(start + 1, end);
    if (!content || /[\r\n]/.test(content) || /^\s|\s$/.test(content)) return false;
    if (silent) return true;

    const token = state.push(type, type, 0);
    token.content = content;
    token.markup = String.fromCharCode(marker);
    state.pos = end + 1;
    return true;
  };
}

export default function markdownItSubSup(md) {
  md.inline.ruler.before("emphasis", "sub", createRule(0x7E, "sub"));
  md.inline.ruler.before("emphasis", "sup", createRule(0x5E, "sup"));
  md.renderer.rules.sub = (tokens, index) => `<sub>${md.utils.escapeHtml(tokens[index].content)}</sub>`;
  md.renderer.rules.sup = (tokens, index) => `<sup>${md.utils.escapeHtml(tokens[index].content)}</sup>`;
}
