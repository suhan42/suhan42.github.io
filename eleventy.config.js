// Eleventy 构建配置：输入目录 src/，输出目录 site/。
// 仅注册构建规则和目录结构，不承载业务内容；配置按 ES Module 执行。
import { readFileSync } from "node:fs";
import { bundledLanguages, createHighlighter } from "shiki";
import { transformerRenderLineNumber } from "@shikijs/transformers";

const customPages = JSON.parse(readFileSync(new URL("./src/_data/custom-pages.json", import.meta.url), "utf8"));

// 构建期只创建一次高亮器，加载 Shiki 内置语言全集，后续文章新增语言不需要改配置。
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: Object.keys(bundledLanguages)
});
const loadedLanguages = new Set(highlighter.getLoadedLanguages());
const warnedLanguages = new Set();

// 未知语言回退到 text，并只提示一次，避免单篇文章的标记错误中断整站构建。
function highlightCode(code, lang) {
  const requested = (lang || "text").toLowerCase();
  let language = requested;
  if (language !== "text" && !loadedLanguages.has(language)) {
    if (!warnedLanguages.has(language)) {
      console.warn(`[Shiki] 未加载语言 "${language}"，按 text 渲染。`);
      warnedLanguages.add(language);
    }
    language = "text";
  }

  return highlighter.codeToHtml(code.replace(/\n$/, ""), {
    lang: language,
    themes: {
      light: "github-light",
      dark: "github-dark"
    },
    transformers: [transformerRenderLineNumber()]
  });
}

// 把标题内的实体和标签转成纯文本，用于生成目录文案。
function headingText(value) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " " };
  const decoded = value.replace(/<[^>]*>/g, " ").replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    const key = entity.toLowerCase();
    if (key.startsWith("#x")) {
      const codePoint = Number.parseInt(key.slice(2), 16);
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    if (key.startsWith("#")) {
      const codePoint = Number.parseInt(key.slice(1), 10);
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    return Object.prototype.hasOwnProperty.call(entities, key) ? entities[key] : match;
  });
  return decoded.replace(/\s+/g, " ").trim();
}

// 生成适合作为 HTML id 的稳定 slug，保留中文并处理重复标题。
function headingSlug(text, usedIds) {
  const base = text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
  let slug = base;
  let suffix = 2;
  while (usedIds.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

// 转义目录文案，标题本身可能包含尖括号或引号。
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 把标题数组渲染为带层级缩进的目录列表。
function renderTableOfContents(headings) {
  const minLevel = Math.min(...headings.map((heading) => heading.level));
  const items = headings.map((heading) => {
    const depth = Math.min(heading.level - minLevel + 1, 6);
    return `<li class="toc-item toc-level-${depth}"><a href="#${encodeURIComponent(heading.id)}">${escapeHtml(heading.text)}</a></li>`;
  });
  return `<ol class="toc-list">\n${items.join("\n")}\n</ol>`;
}

export default function (eleventyConfig) {
  // 清理 Nunjucks 块标签两侧的缩进与换行，避免构建产物出现只有空格的尾随行。
  eleventyConfig.setNunjucksEnvironmentOptions({ trimBlocks: true, lstripBlocks: true });

  // 让 markdown-it 使用 Shiki 生成构建期 HTML，页面运行时不加载高亮库。
  eleventyConfig.amendLibrary("md", (md) => {
    md.options.highlight = highlightCode;
  });

  // 把根目录 assets/ 原样复制到输出目录的 assets/ 下；src/static/ 的内容（.nojekyll）复制到输出根目录。
  eleventyConfig.addPassthroughCopy({ "assets": "assets", "src/static": "." });

  // 日期显示过滤器：把 JS Date 或 ISO 字符串格式化为 YYYY-MM-DD，用于列表和文章页。
  eleventyConfig.addFilter("dateDisplay", (value) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // ISO 日期过滤器：给 <time datetime> 输出机器可读的 YYYY-MM-DD。
  eleventyConfig.addFilter("dateToIso", (value) => {
    return new Date(value).toISOString().slice(0, 10);
  });

  // 导航高亮过滤器：首页分页归入 Home，文章页按所属分类高亮，其余页面按栏目路径前缀匹配。
  eleventyConfig.addFilter("isNavActive", (itemUrl, currentUrl, category) => {
    if (itemUrl === "/") return currentUrl === "/" || currentUrl.startsWith("/page/");
    if (category && itemUrl === `/categories/${category}/`) return true;
    return currentUrl.startsWith(itemUrl);
  });

  // 只保留 status 为 published 的文章，draft 不进入首页、归档和聚合页。
  eleventyConfig.addCollection("publishedPosts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("./src/content/posts/*.md")
      .concat(collectionApi.getFilteredByGlob("./src/content/posts/*.html"))
      .filter((post) => post.data.status === "published")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // 从 published 文章集合派生分类列表，用于侧栏和页脚，不再硬编码。
  eleventyConfig.addCollection("categories", (collectionApi) => {
    const set = new Set();
    const posts = collectionApi.getFilteredByGlob("./src/content/posts/*.md")
      .concat(collectionApi.getFilteredByGlob("./src/content/posts/*.html"))
      .filter((post) => post.data.status === "published");
    for (const post of posts) {
      if (post.data.category) set.add(post.data.category);
    }
    return Array.from(set).sort();
  });

  // 从 published 文章集合派生标签列表，用于侧栏。
  eleventyConfig.addCollection("allTags", (collectionApi) => {
    const set = new Set();
    const posts = collectionApi.getFilteredByGlob("./src/content/posts/*.md")
      .concat(collectionApi.getFilteredByGlob("./src/content/posts/*.html"))
      .filter((post) => post.data.status === "published");
    for (const post of posts) {
      if (Array.isArray(post.data.tags)) {
        for (const tag of post.data.tags) set.add(tag);
      }
    }
    return Array.from(set).sort();
  });

  // 按年份分组过滤器，用于归档页；输入已排序的 posts 数组，输出 [年份, 该年文章数组] 键值对数组。
  eleventyConfig.addFilter("groupByYear", (posts) => {
    const map = new Map();
    for (const post of posts) {
      const year = new Date(post.data.date).getFullYear();
      if (!map.has(year)) map.set(year, []);
      map.get(year).push(post);
    }
    return Array.from(map.entries());
  });

  // 从文章正文提取第一个段落作为列表摘要，避免要求每篇文章单独维护 front matter summary。
  // 优先匹配 Markdown 段落；文章型 HTML 直接取第一个 <p>，并把内联标签剥离成纯文本。
  eleventyConfig.addFilter("excerpt", (content, limit = 150) => {
    if (!content) return "";
    const withoutHeading = content.replace(/<!--[\s\S]*?-->/g, "").replace(/^#{1,6}\s.*$/m, "").trim();
    let match = withoutHeading.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    let text = match ? match[1] : withoutHeading.split(/\n\s*\n/)[0] || "";
    text = text.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trimEnd()}…`;
  });

  // 为文章正文标题补齐 id，并同步生成目录；没有标题的文章返回空目录，由模板保持单栏布局。
  eleventyConfig.addFilter("withToc", (content) => {
    if (!content) return { content: "", toc: "", hasToc: false };

    const headings = [];
    const usedIds = new Set();
    const html = String(content).replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
      const text = headingText(inner);
      if (!text) return match;

      const idMatch = attrs.match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const existingId = idMatch ? idMatch[1] ?? idMatch[2] : "";
      const id = existingId || headingSlug(text, usedIds);
      const nextAttrs = existingId ? attrs : ` id="${escapeHtml(id)}"${attrs}`;
      usedIds.add(id);
      headings.push({ level: Number(level), id, text });
      return `<h${level}${nextAttrs}>${inner}</h${level}>`;
    });

    return {
      content: html,
      toc: headings.length > 0 ? renderTableOfContents(headings) : "",
      hasToc: headings.length > 0
    };
  });

  // RSS 需要的 RFC 822 日期格式过滤器。
  eleventyConfig.addFilter("dateToRfc822", (value) => {
    return new Date(value).toUTCString();
  });

  // JSON 输出过滤器，用于搜索索引中的中文和特殊字符转义。
  eleventyConfig.addFilter("toJson", (value) => JSON.stringify(value));

  // 全局数据：特殊页受控元数据给首页 Works 区使用；当前年份给页脚版权行使用。
  eleventyConfig.addGlobalData("customPages", customPages);
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}
