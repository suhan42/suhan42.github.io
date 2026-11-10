// Markdown-it 的 GitHub/Typora callout 规则：> [!NOTE] 等五种提示块。
// 这里直接转换 blockquote token，不新增依赖。
const LABELS = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution"
};

function githubAlerts(state) {
  const tokens = state.tokens;
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type !== "blockquote_open") continue;

    let inlineIndex = -1;
    let depth = 0;
    for (let cursor = index + 1; cursor < tokens.length; cursor += 1) {
      if (tokens[cursor].type === "blockquote_open") depth += 1;
      if (tokens[cursor].type === "blockquote_close") {
        if (depth === 0) break;
        depth -= 1;
      }
      if (tokens[cursor].type === "inline" && depth === 0) {
        inlineIndex = cursor;
        break;
      }
    }
    if (inlineIndex === -1) continue;

    const inline = tokens[inlineIndex];
    const first = inline.children && inline.children[0];
    if (!first || first.type !== "text") continue;
    const match = first.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/);
    if (!match) continue;

    const type = match[1].toLowerCase();
    tokens[index].attrJoin("class", `callout callout-${type}`);
    tokens[index].attrSet("data-callout-label", LABELS[match[1]]);

    inline.children.shift();
    if (inline.children[0] && inline.children[0].type === "softbreak") inline.children.shift();
    inline.content = inline.content.replace(/^\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/, "");
  }
}

export default function markdownItGithubAlerts(md) {
  md.core.ruler.after("inline", "github-alerts", githubAlerts);
}
