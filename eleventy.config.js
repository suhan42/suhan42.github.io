// Eleventy 构建配置：输入目录 src/，输出目录 site/。
// 仅注册构建规则和目录结构，不承载业务内容。

export default function (eleventyConfig) {
  // 把根目录 assets/ 原样复制到输出目录的 assets/ 下。
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

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
