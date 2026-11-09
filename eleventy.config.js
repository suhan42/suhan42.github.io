// Eleventy 构建配置：输入目录 src/，输出目录 site/。
// 仅注册构建规则和目录结构，不承载业务内容。

export default function (eleventyConfig) {
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

  // RSS 需要的 RFC 822 日期格式过滤器。
  eleventyConfig.addFilter("dateToRfc822", (value) => {
    return new Date(value).toUTCString();
  });

  // JSON 输出过滤器，用于搜索索引中的中文和特殊字符转义。
  eleventyConfig.addFilter("toJson", (value) => JSON.stringify(value));

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
