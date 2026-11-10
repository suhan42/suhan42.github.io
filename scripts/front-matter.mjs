// 共享的 front matter 解析器，供内容校验和输出校验复用。
// 当前内容受控且结构简单，这里只保留项目需要的 YAML 子集，不引入额外解析依赖。
export function parseFrontMatter(content) {
  if (!content.startsWith("---")) {
    return { data: null, error: "缺少 front matter 起始标记 ---" };
  }
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    return { data: null, error: "缺少 front matter 结束标记 ---" };
  }
  const fmText = match[1].trim();
  const lines = fmText.split("\n");
  const data = {};
  let currentKey = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("- ")) {
      if (currentKey) {
        if (!Array.isArray(data[currentKey])) data[currentKey] = [];
        data[currentKey].push(trimmed.slice(2).trim());
      }
    } else if (trimmed.includes(":")) {
      const index = trimmed.indexOf(":");
      currentKey = trimmed.slice(0, index).trim();
      data[currentKey] = trimmed.slice(index + 1).trim();
    }
  }
  return { data, error: null };
}
