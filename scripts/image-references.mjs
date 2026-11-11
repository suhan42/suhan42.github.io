// 图片引用解析工具：供内容校验和图片迁移脚本复用，统一 Markdown、HTML、注释和代码块的边界。
// 代码块、行内代码、HTML 注释、pre/code/script/style 内的图片示例不参与收集和改写。

import MarkdownIt from "markdown-it";

export const IMAGE_FILE_PATTERN = /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i;

const MARKDOWN_IMAGE_PATTERN = /(!\[[^\]]*\]\(\s*)(<[^>]+>|[^)\s]+)(\s*(?:"[^"]*"|'[^']*')?\s*\))/g;
const HTML_IMAGE_PATTERN = /(<img\b[^>]*?\bsrc\s*=\s*)(["'])([^"']+)\2/gi;
const HTML_PROTECTED_PATTERN = /<!--[\s\S]*?-->|<pre\b[\s\S]*?<\/pre>|<code\b[\s\S]*?<\/code>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi;
const FRONT_MATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

// 保护范围以 markdown-it 的 token 为准，避免正则漏掉缩进代码块、双反引号行内代码和嵌套围栏。
// HTML 文章和 Markdown 中的 pre/code/script/style 仍用标签级保护，最后合并成不重叠区间。
const markdown = new MarkdownIt({ html: true });

function getLineStarts(content) {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    if (content[index] === "\n") starts.push(index + 1);
  }
  return starts;
}

function lineOffset(starts, line, contentLength) {
  return line < starts.length ? starts[line] : contentLength;
}

// 扫描 CommonMark 反引号代码段，支持双反引号及更长分隔符；返回包含分隔符的源码范围。
function collectBacktickCodeRanges(text, baseOffset) {
  const ranges = [];
  let cursor = 0;
  while (cursor < text.length) {
    if (text[cursor] !== "`") {
      cursor += 1;
      continue;
    }
    const openStart = cursor;
    while (text[cursor] === "`") cursor += 1;
    const delimiterLength = cursor - openStart;
    let closeStart = -1;
    let search = cursor;
    while (search < text.length) {
      const next = text.indexOf("`", search);
      if (next === -1) break;
      let closeEnd = next;
      while (text[closeEnd] === "`") closeEnd += 1;
      if (closeEnd - next === delimiterLength) {
        closeStart = next;
        cursor = closeEnd;
        break;
      }
      search = closeEnd;
    }
    if (closeStart === -1) continue;
    ranges.push({ start: baseOffset + openStart, end: baseOffset + cursor });
  }
  return ranges;
}

function collectMarkdownProtectedRanges(content) {
  const ranges = [];
  const frontMatter = content.match(FRONT_MATTER_PATTERN);
  if (frontMatter) ranges.push({ start: 0, end: frontMatter[0].length });

  let tokens;
  try {
    tokens = markdown.parse(content, {});
  } catch (error) {
    return ranges;
  }

  const lineStarts = getLineStarts(content);
  const visit = (token) => {
    if ((token.type === "fence" || token.type === "code_block") && token.map) {
      ranges.push({
        start: lineOffset(lineStarts, token.map[0], content.length),
        end: lineOffset(lineStarts, token.map[1], content.length)
      });
    }

    if (token.type === "inline" && token.children) {
      const blockStart = token.map ? lineOffset(lineStarts, token.map[0], content.length) : 0;
      const blockEnd = token.map ? lineOffset(lineStarts, token.map[1], content.length) : content.length;
      const rawBlock = content.slice(blockStart, blockEnd);
      const contentIndex = rawBlock.indexOf(token.content);
      const scanBase = contentIndex === -1 ? blockStart : blockStart + contentIndex;
      const scanText = contentIndex === -1 ? rawBlock : token.content;
      ranges.push(...collectBacktickCodeRanges(scanText, scanBase));
      for (const child of token.children) visit(child);
    }

    if (token.children && token.type !== "inline") {
      for (const child of token.children) visit(child);
    }
  };

  for (const token of tokens) visit(token);
  return ranges;
}

function collectHtmlProtectedRanges(content) {
  const ranges = [];
  for (const match of content.matchAll(HTML_PROTECTED_PATTERN)) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }
  return ranges;
}

function mergeRanges(ranges, contentLength) {
  const sorted = ranges
    .map((range) => ({
      start: Math.max(0, Math.min(range.start, contentLength)),
      end: Math.max(0, Math.min(range.end, contentLength))
    }))
    .filter((range) => range.end > range.start)
    .sort((left, right) => left.start - right.start || left.end - right.end);

  const merged = [];
  for (const range of sorted) {
    const previous = merged[merged.length - 1];
    if (!previous || range.start > previous.end) {
      merged.push({ ...range });
    } else {
      previous.end = Math.max(previous.end, range.end);
    }
  }
  return merged;
}

function getProtectedRanges(content) {
  return mergeRanges(
    [...collectMarkdownProtectedRanges(content), ...collectHtmlProtectedRanges(content)],
    content.length
  );
}

function replaceOutsideProtected(content, ranges, pattern, replacer) {
  let result = "";
  let cursor = 0;
  for (const range of ranges) {
    if (range.start > cursor) {
      result += content.slice(cursor, range.start).replace(pattern, replacer);
    }
    result += content.slice(range.start, range.end);
    cursor = range.end;
  }
  result += content.slice(cursor).replace(pattern, replacer);
  return result;
}

function getUnprotectedSegments(content) {
  const ranges = getProtectedRanges(content);
  const segments = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start > cursor) segments.push(content.slice(cursor, range.start));
    cursor = range.end;
  }
  segments.push(content.slice(cursor));
  return segments;
}

function normalizeReferenceLabel(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

// 收集正文中的 Markdown 图片和 HTML img src，返回原始引用文本供迁移脚本精确替换。
export function collectImageReferences(content) {
  const ranges = getProtectedRanges(content);
  const references = [];
  replaceOutsideProtected(content, ranges, MARKDOWN_IMAGE_PATTERN, (match, prefix, target) => {
    references.push(target);
    return match;
  });
  replaceOutsideProtected(content, ranges, HTML_IMAGE_PATTERN, (match, prefix, quote, url) => {
    references.push(url);
    return match;
  });
  return [...new Set(references)];
}

// 按原始引用文本替换图片地址，保留 alt、title、引号风格和查询串。
export function rewriteImageReferences(content, replacements) {
  // 第一轮替换会改变字符串长度，第二轮必须基于改写后的内容重新计算保护范围，否则代码块边界会整体错位。
  const markdownResult = replaceOutsideProtected(content, getProtectedRanges(content), MARKDOWN_IMAGE_PATTERN, (match, prefix, target, suffix) => {
    const newUrl = replacements.get(target);
    return newUrl ? `${prefix}${newUrl}${suffix}` : match;
  });
  return replaceOutsideProtected(markdownResult, getProtectedRanges(markdownResult), HTML_IMAGE_PATTERN, (match, prefix, quote, url) => {
    const newUrl = replacements.get(url);
    return newUrl ? `${prefix}${quote}${newUrl}${quote}` : match;
  });
}

// 解析图片引用：去掉 Markdown 的尖括号包裹，拆分查询串和锚点，并统一正斜杠。
export function parseImageReference(value) {
  const unwrapped = value
    .trim()
    .replace(/^<([\s\S]*)>$/, "$1")
    .replace(/&amp;/g, "&");
  const match = unwrapped.match(/^([^?#]*)([?#].*)?$/);
  return {
    raw: value,
    path: (match ? match[1] : unwrapped).replace(/\\/g, "/"),
    suffix: match && match[2] ? match[2] : ""
  };
}

export function decodeImagePath(value) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

// 收集暂不支持的图片语法，返回可直接展示给作者的中文问题列表。
export function collectUnsupportedImageSyntax(content) {
  const issues = [];
  const segments = getUnprotectedSegments(content);
  const definitions = new Map();

  for (const segment of segments) {
    for (const match of segment.matchAll(/^ {0,3}\[([^\]]+)\]:\s*(\S+)/gm)) {
      const label = normalizeReferenceLabel(match[1]);
      if (!label.startsWith("^")) definitions.set(label, match[2]);
    }
  }

  for (const segment of segments) {
    for (const match of segment.matchAll(/!\[([^\]]*)\]\[([^\]]*)\]/g)) {
      const label = normalizeReferenceLabel(match[2] || match[1]);
      if (definitions.has(label)) {
        issues.push(`暂不支持引用式图片语法，请改成内联 ![](/assets/images/...)：${match[0]}`);
      }
    }

    for (const match of segment.matchAll(/!\[([^\]]+)\](?![ \t]*[\(\[])/g)) {
      const label = normalizeReferenceLabel(match[1]);
      if (definitions.has(label)) {
        issues.push(`暂不支持引用式图片语法，请改成内联 ![](/assets/images/...)：${match[0]}`);
      }
    }

    for (const match of segment.matchAll(/<(?:img|source)\b[^>]*?\bsrcset\s*=\s*(["'])([^"']*)\1/gi)) {
      const srcset = match[2];
      // data URL 里可能带逗号，简单跳过整个属性，避免把它误拆成多个候选。
      if (srcset.includes("data:")) continue;
      const relativeCandidate = srcset
        .split(",")
        .map(candidate => candidate.trim())
        .filter(Boolean)
        .find(candidate => {
          const url = candidate.split(/\s+/)[0];
          return url && !isRemoteImageUrl(url) && !url.startsWith("/assets/images/");
        });
      if (relativeCandidate) {
        issues.push(`暂不支持相对 srcset，请改成内联 <img src="/assets/images/...">：${match[0]}`);
      }
    }
  }

  return [...new Set(issues)];
}

// 只放行 HTTP/HTTPS、data/blob 和协议相对地址，其余协议按本地路径处理。
export function isRemoteImageUrl(urlPath) {
  if (!urlPath) return false;
  if (urlPath.startsWith("//")) return true;
  return /^(?:https?:|data:|blob:)/i.test(urlPath);
}
