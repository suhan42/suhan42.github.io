// 从已渲染 HTML 中提取第一张可用于卡片封面的真实图片，跳过注释和 data/blob 地址。
export function firstImage(content) {
  if (!content) return "";
  const html = String(content).replace(/<!--[\s\S]*?-->/g, "");
  const matches = html.matchAll(/<img\b[^>]*?\ssrc\s*=\s*(["'])(.*?)\1/gi);
  for (const match of matches) {
    const src = match[2].replace(/&amp;/g, "&").trim();
    if (src && !/^(?:data|blob):/i.test(src)) return src;
  }
  return "";
}
