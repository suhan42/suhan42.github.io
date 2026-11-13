// 构建期文章图片规划：识别相对图片，计算输出路径，并生成渲染期 URL 改写映射。
// 这里只读取源码和做规划，不修改文章；图片复制由 Eleventy 的 passthrough copy 负责。

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { parseFrontMatter } from "./front-matter.mjs";
import {
  IMAGE_FILE_PATTERN,
  collectImageReferences,
  collectUnsupportedImageSyntax,
  decodeImagePath,
  isRemoteImageUrl,
  parseImageReference,
  rewriteImageReferences
} from "./image-references.mjs";

export const POSTS_DIR = resolve("src/content/posts");
export const IMAGES_DIR = resolve("assets/images");
export const SUBCATEGORY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const POST_FILE_PATTERN = /\.(?:md|html)$/i;

function toPosix(value) {
  return String(value).split(sep).join("/");
}

function displayPath(filePath) {
  return toPosix(relative(process.cwd(), filePath));
}

export function isInside(parent, child) {
  const relativePath = relative(parent, child);
  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(".." + sep) &&
      !isAbsolute(relativePath))
  );
}

function hashFile(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function walkPostFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkPostFiles(fullPath));
    } else if (POST_FILE_PATTERN.test(entry.name) && !entry.name.startsWith(".")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getSubcategoryFromFile(postFile, postsDir) {
  const relativePath = relative(postsDir, postFile);
  if (!relativePath || relativePath.startsWith("..") || isAbsolute(relativePath)) return "";
  const segments = relativePath.split(sep);
  if (segments.length <= 1) return "";
  return SUBCATEGORY_PATTERN.test(segments[0]) ? segments[0] : "";
}

// 输入路径可能是 Eleventy 的相对路径，也可能来自 CLI；统一解析后只把合法 slug 目录视为子分类。
export function getPostSubcategory(inputPath, postsDir = POSTS_DIR) {
  return getSubcategoryFromFile(resolve(inputPath), resolve(postsDir));
}

// 子分类目录优先作为图片命名空间；非 slug 目录是文章资源包，回退到 front matter slug。
function getNamespace(postFile, data, postsDir) {
  const subcategory = getSubcategoryFromFile(postFile, postsDir);
  if (subcategory) return subcategory;
  const slug = String(data?.slug || "").trim();
  if (SUBCATEGORY_PATTERN.test(slug)) return slug;
  throw new Error(
    `无法确定图片命名空间：${displayPath(postFile)} 的目录名不是合法 slug，front matter slug 也不是合法 slug`
  );
}

export function normalizeCoverValue(value) {
  return String(value || "")
    .trim()
    .replace(/^(["'])([\s\S]*)\1$/, "$2");
}

// 覆盖 front matter 的 cover，同时保留原有引号和字段格式。
export function rewriteCoverReference(content, replacements) {
  if (!replacements || replacements.size === 0) return content;
  const frontMatter = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/);
  if (!frontMatter) return content;
  const nextFrontMatter = frontMatter[2].replace(
    /^(cover:\s*)(["']?)([^"'\r\n]+?)(\2)\s*$/m,
    (match, prefix, quote, value) => {
      const newUrl = replacements.get(value);
      return newUrl ? `${prefix}${quote}${newUrl}${quote}` : match;
    }
  );
  return `${frontMatter[1]}${nextFrontMatter}${frontMatter[3]}${content.slice(frontMatter[0].length)}`;
}

export function rewritePostImageReferences(content, replacements) {
  if (!replacements || replacements.size === 0) return content;
  return rewriteCoverReference(rewriteImageReferences(content, replacements), replacements);
}

function describeConflict(sourcePath, destinationPath) {
  return [
    `图片目标冲突：${displayPath(sourcePath)}`,
    `  目标位置：${displayPath(destinationPath)}`,
    "  目标已存在且内容不同，请重命名源图片或调整文章中的图片路径。"
  ].join("\n");
}

// 规划单篇文章：相对图片会落到 assets/images/<namespace>/<文件名>。
export function createPostAssetPlan(postFile, options = {}) {
  const postsDir = resolve(options.postsDir || POSTS_DIR);
  const imagesDir = resolve(options.imagesDir || IMAGES_DIR);
  const absolutePostFile = resolve(postFile);
  const content = readFileSync(absolutePostFile, "utf8");
  const { data, error } = parseFrontMatter(content);
  if (error) throw new Error(`${displayPath(absolutePostFile)}: ${error}`);

  const unsupported = collectUnsupportedImageSyntax(content);
  if (unsupported.length > 0) {
    throw new Error(`${displayPath(absolutePostFile)}: ${unsupported.join("；")}`);
  }

  const namespace = getNamespace(absolutePostFile, data, postsDir);
  const references = new Set(collectImageReferences(content));
  const cover = normalizeCoverValue(data.cover);
  if (cover) references.add(cover);

  const replacements = new Map();
  const copies = new Map();

  for (const rawTarget of references) {
    const { path: imagePath, suffix } = parseImageReference(rawTarget);
    if (!imagePath || imagePath.startsWith("#") || isRemoteImageUrl(imagePath)) continue;
    if (imagePath.split("/").includes("..")) {
      throw new Error(`${displayPath(absolutePostFile)}: 图片引用不能包含 ..：${rawTarget}`);
    }
    if (imagePath.startsWith("/assets/images/")) continue;
    if (imagePath.startsWith("/")) {
      throw new Error(`${displayPath(absolutePostFile)}: 站内图片必须使用 /assets/images/...：${rawTarget}`);
    }
    if (
      imagePath === "assets/images" ||
      imagePath.startsWith("assets/images/") ||
      imagePath.includes("/assets/images/")
    ) {
      throw new Error(`${displayPath(absolutePostFile)}: 相对图片不能直接指向 assets/images：${rawTarget}`);
    }
    if (!IMAGE_FILE_PATTERN.test(imagePath)) {
      throw new Error(`${displayPath(absolutePostFile)}: 不支持的图片扩展名：${rawTarget}`);
    }

    const sourcePath = resolve(dirname(absolutePostFile), decodeImagePath(imagePath));
    if (!isInside(dirname(absolutePostFile), sourcePath)) {
      throw new Error(`${displayPath(absolutePostFile)}: 相对图片必须在文章目录内：${rawTarget}`);
    }
    if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
      throw new Error(`${displayPath(absolutePostFile)}: 相对图片不存在：${rawTarget}`);
    }

    const destinationRelative = join(namespace, basename(sourcePath));
    const destinationPath = join(imagesDir, destinationRelative);
    if (!isInside(imagesDir, destinationPath)) {
      throw new Error(`${displayPath(absolutePostFile)}: 图片目标越出 assets/images：${rawTarget}`);
    }
    if (existsSync(destinationPath)) {
      if (!statSync(destinationPath).isFile() || hashFile(sourcePath) !== hashFile(destinationPath)) {
        throw new Error(describeConflict(sourcePath, destinationPath));
      }
    } else {
      copies.set(sourcePath, {
        sourcePath,
        destinationPath,
        destinationOutput: `assets/images/${toPosix(destinationRelative)}`
      });
    }

    replacements.set(rawTarget, `/assets/images/${toPosix(destinationRelative)}${suffix}`);
  }

  return {
    inputPath: absolutePostFile,
    namespace,
    replacements,
    copies: [...copies.values()]
  };
}

// 规划全部文章，同时提前发现跨文章的目标路径冲突。
export function buildPostAssetPlans(options = {}) {
  const postsDir = resolve(options.postsDir || POSTS_DIR);
  const imagesDir = resolve(options.imagesDir || IMAGES_DIR);
  const postFiles = options.postFiles
    ? options.postFiles.map((file) => resolve(file))
    : walkPostFiles(postsDir);
  const plans = new Map();
  const copies = new Map();

  for (const postFile of postFiles) {
    const plan = createPostAssetPlan(postFile, { postsDir, imagesDir });
    plans.set(plan.inputPath, plan);
    for (const copy of plan.copies) {
      const existing = copies.get(copy.destinationPath);
      if (existing && resolve(existing.sourcePath) !== resolve(copy.sourcePath)) {
        throw new Error(
          [
            `两张不同图片会复制到同一目标：${displayPath(copy.destinationPath)}`,
            `  来源 1：${displayPath(existing.sourcePath)}`,
            `  来源 2：${displayPath(copy.sourcePath)}`,
            "  请重命名其中一张图片，或调整文章中的相对路径。"
          ].join("\n")
        );
      }
      copies.set(copy.destinationPath, copy);
    }
  }

  return { plans, copies, postFiles };
}
