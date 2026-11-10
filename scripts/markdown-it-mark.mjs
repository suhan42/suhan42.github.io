// Markdown-it 的 ==高亮== 规则，参考 markdown-it-mark 的 delimiter 处理方式。
// 这里内联实现，避免为一个小功能新增构建期依赖。
export default function markPlugin(md) {
  // 把成对的 == 标记拆成文本 token，并登记到 delimiter 列表。
  function tokenize(state, silent) {
    const start = state.pos;
    const marker = state.src.charCodeAt(start);
    if (silent) return false;
    if (marker !== 0x3D) return false;

    const scanned = state.scanDelims(state.pos, true);
    let length = scanned.length;
    const char = String.fromCharCode(marker);
    if (length < 2) return false;

    if (length % 2) {
      const token = state.push("text", "", 0);
      token.content = char;
      length -= 1;
    }

    for (let index = 0; index < length; index += 2) {
      const token = state.push("text", "", 0);
      token.content = char + char;
      if (!scanned.can_open && !scanned.can_close) continue;
      state.delimiters.push({
        marker,
        length: 0,
        jump: index / 2,
        token: state.tokens.length - 1,
        end: -1,
        open: scanned.can_open,
        close: scanned.can_close
      });
    }

    state.pos += scanned.length;
    return true;
  }

  // 把 delimiter 对转换成 mark_open / mark_close token。
  function postProcess(state, delimiters) {
    const loneMarkers = [];
    for (let index = 0; index < delimiters.length; index += 1) {
      const startDelim = delimiters[index];
      if (startDelim.marker !== 0x3D || startDelim.end === -1) continue;

      const endDelim = delimiters[startDelim.end];
      const openToken = state.tokens[startDelim.token];
      openToken.type = "mark_open";
      openToken.tag = "mark";
      openToken.nesting = 1;
      openToken.markup = "==";
      openToken.content = "";

      const closeToken = state.tokens[endDelim.token];
      closeToken.type = "mark_close";
      closeToken.tag = "mark";
      closeToken.nesting = -1;
      closeToken.markup = "==";
      closeToken.content = "";

      if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "=") {
        loneMarkers.push(endDelim.token - 1);
      }
    }

    while (loneMarkers.length) {
      const index = loneMarkers.pop();
      let next = index + 1;
      while (next < state.tokens.length && state.tokens[next].type === "mark_close") next += 1;
      next -= 1;
      if (index !== next) {
        const token = state.tokens[next];
        state.tokens[next] = state.tokens[index];
        state.tokens[index] = token;
      }
    }
  }

  md.inline.ruler.before("emphasis", "mark", tokenize);
  md.inline.ruler2.before("emphasis", "mark", (state) => {
    const tokensMeta = state.tokens_meta;
    const max = (tokensMeta || []).length;
    postProcess(state, state.delimiters);
    for (let index = 0; index < max; index += 1) {
      if (tokensMeta[index] && tokensMeta[index].delimiters) {
        postProcess(state, tokensMeta[index].delimiters);
      }
    }
  });
}
