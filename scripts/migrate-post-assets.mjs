// 文章图片迁移脚本：把文章里的相对图片引用搬到 assets/images/ 下，并改写为站点绝对路径。
// 默认只打印迁移计划，传 --write 才复制图片、改写文章并删除源文件；构建流程不会自动调用，避免构建时修改源码。

import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
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

const POSTS_DIR = resolve("src/content/posts");
const IMAGES_DIR = resolve("assets/images");
const POST_FILE_PATTERN = /\.(?:md|html)$/i;

const args = process.argv.slice(2);
const write = args.includes("--write");
const toIndex = args.indexOf("--to");
const customNamespace = toIndex === -1 ? "" : args[toIndex + 1] || "";
const inputs = args.filter((arg, index) => {
  if (arg.startsWith("--")) return false;
  if (toIndex !== -1 && index === toIndex + 1) return false;
  return true;
});

// 只允许 --write 和 --to 两个参数，避免拼写错误时静默按 dry-run 执行。
for (const arg of args) {
  if (arg.startsWith("--") && arg !== "--write" && arg !== "--to") {
    fail(`未知参数：${arg}`);
  }
}
if (toIndex !== -1 && (!customNamespace || customNamespace.startsWith("--"))) {
  fail("--to 需要一个 assets/images 下的相对子目录。");
}
if (inputs.length === 0) {
  fail("用法：npm run assets:migrate -- <文章或目录> [--to <子目录>] [--write]");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function isInside(parent, child) {
  const relativePath = relative(parent, child);
  return (
    relativePath === "" ||
    (relativePath !== ".." && !relativePath.startsWith(".." + sep) && !isAbsolute(relativePath))
  );
}

function displayPath(filePath) {
  return relative(".", filePath).split(sep).join("/");
}

function displayRelativePath(filePath) {
  return filePath.split(sep).join("/");
}

// 冲突信息只说明原因和处理选项，不自动改名、移动或覆盖文件。
function formatConflict(title, details, options) {
  const lines = [title];
  for (const detail of details) lines.push(`    ${detail}`);
  lines.push("    处理方式（脚本不会自动改名、移动或覆盖）：");
  options.forEach((option, index) => lines.push(`      ${index + 1}. ${option}`));
  return lines.join("\n");
}

function walkDirectory(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else if (POST_FILE_PATTERN.test(entry.name) && !entry.name.startsWith(".")) {
      files.push(fullPath);
    }
  }
  return files;
}

function collectPostFiles(paths) {
  const files = new Set();
  for (const input of paths) {
    const fullPath = resolve(input);
    if (!isInside(POSTS_DIR, fullPath)) {
      fail(`只能处理 ${displayPath(POSTS_DIR)}/ 下的文章：${input}`);
    }
    if (!existsSync(fullPath)) {
      fail(`路径不存在：${input}`);
    }
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      for (const file of walkDirectory(fullPath)) files.add(file);
    } else if (POST_FILE_PATTERN.test(fullPath)) {
      files.add(fullPath);
    } else {
      fail(`不是 Markdown 或 HTML 文章：${input}`);
    }
  }
  return [...files].sort();
}

function normalizeCustomNamespace(value) {
  const normalized = value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const segments = normalized.split("/");
  if (
    !normalized ||
    /^[a-z]:/i.test(normalized) ||
    segments.some(segment => !segment || segment === "." || segment === "..")
  ) {
    fail(`--to 必须是 assets/images 下的相对子目录：${value}`);
  }
  return segments.join("/");
}

function slugifyStem(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 子分类文章使用目录名作为图片命名空间，根目录文章优先使用 front matter slug。
function getNamespace(postFile) {
  if (normalizedCustomNamespace) return normalizedCustomNamespace;
  const relativePath = relative(POSTS_DIR, postFile);
  const segments = relativePath.split(sep);
  if (segments.length > 1) return segments[0];
  const content = readFileSync(postFile, "utf8");
  const { data } = parseFrontMatter(content);
  if (data && data.slug) return data.slug;
  const stem = basename(postFile, extname(postFile));
  const slug = slugifyStem(stem);
  return slug || `post-${createHash("sha1").update(stem).digest("hex").slice(0, 6)}`;
}

function shouldSkipImageUrl(urlPath) {
  return !urlPath || urlPath.startsWith("#") || urlPath.startsWith("/") || isRemoteImageUrl(urlPath);
}

function hashFile(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

// 目标路径默认是 assets/images/<子分类>/<文件名>，例如 ./imgs-Docker/a.png 会落到 assets/images/docker/a.png。
function planReference(postFile, namespace, rawTarget) {
  const { path: urlPath, suffix } = parseImageReference(rawTarget);
  if (shouldSkipImageUrl(urlPath) || !IMAGE_FILE_PATTERN.test(urlPath)) return null;

  const sourcePath = resolve(dirname(postFile), decodeImagePath(urlPath));
  const insideImages = isInside(IMAGES_DIR, sourcePath);
  if (insideImages) {
    throw new Error(`相对图片不能直接指向 assets/images，请改写成 /assets/images/...：${rawTarget}`);
  }

  if (!isInside(POSTS_DIR, sourcePath)) {
    throw new Error(`相对图片指向文章目录之外：${rawTarget}`);
  }

  const destinationRelative = join(namespace, basename(sourcePath));
  const destinationPath = join(IMAGES_DIR, destinationRelative);
  if (!isInside(IMAGES_DIR, destinationPath)) {
    throw new Error(`目标路径越出 assets/images：${rawTarget}`);
  }

  const destinationUrl = `/assets/images/${destinationRelative.split(sep).join("/")}${suffix}`;
  const sourceExists = existsSync(sourcePath);
  const destinationExists = existsSync(destinationPath);
  if (sourceExists && !statSync(sourcePath).isFile()) {
    throw new Error(`图片路径不是文件：${rawTarget}`);
  }
  if (!sourceExists && !destinationExists) {
    throw new Error(`图片不存在：${rawTarget}`);
  }

  // 目标已存在时只接受内容完全相同的文件，避免静默覆盖用户资源。
  let needsMove = sourceExists && resolve(sourcePath) !== resolve(destinationPath);
  if (sourceExists && destinationExists && hashFile(sourcePath) === hashFile(destinationPath)) {
    needsMove = false;
  } else if (sourceExists && destinationExists) {
    throw new Error(
      formatConflict(
        `目标文件已存在且内容不同，拒绝覆盖：${displayRelativePath(destinationRelative)}`,
        [
          `来源图片：${displayPath(sourcePath)}`,
          `文章引用：${rawTarget}`,
          `已有目标：${displayPath(destinationPath)}`
        ],
        [
          "重命名源图片或已有目标图片，保证文件名不同",
          "用 --to <子目录> 把这次迁移放到独立目录",
          "手动核对后删除或替换已有目标文件"
        ]
      )
    );
  }

  return {
    rawTarget,
    sourcePath,
    destinationPath,
    destinationRelative,
    destinationUrl,
    needsMove
  };
}

function collectCoverReference(content) {
  const frontMatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontMatter) return "";
  const coverLine = frontMatter[1].match(/^cover:\s*(.+?)\s*$/m);
  if (!coverLine) return "";
  const value = coverLine[1].trim();
  return value.replace(/^(["'])(.*)\1$/, "$2");
}

function collectReferences(content) {
  const references = [...collectImageReferences(content)];
  const cover = collectCoverReference(content);
  if (cover) references.push(cover);
  return [...new Set(references)];
}

function rewriteCoverReference(content, replacements) {
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

function pruneEmptyDirectories(startPath, stopPath) {
  let current = startPath;
  while (isInside(stopPath, current) && current !== stopPath) {
    try {
      if (readdirSync(current).length > 0) break;
      rmdirSync(current);
    } catch (error) {
      break;
    }
    current = dirname(current);
  }
}

// 写入前先记录完整迁移计划，进程被中断时仍可从系统临时目录恢复原文和源图片。
function createJournal(moves, plans) {
  const journalPath = join(tmpdir(), `suhan42-asset-migration-${Date.now()}-${process.pid}.json`);
  const journal = {
    createdAt: new Date().toISOString(),
    status: "pending",
    moves: Array.from(moves, ([sourcePath, move]) => ({
      source: sourcePath,
      sourceDisplay: displayPath(sourcePath),
      destination: move.destinationPath,
      destinationDisplay: displayPath(move.destinationPath),
      postFile: move.postFile
    })),
    posts: plans.map((plan) => ({
      file: plan.postFile,
      fileDisplay: displayPath(plan.postFile),
      original: plan.content
    }))
  };
  writeFileSync(journalPath, JSON.stringify(journal, null, 2), "utf8");
  return journalPath;
}

function removeJournal(journalPath) {
  try {
    unlinkSync(journalPath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return true;
    return false;
  }
}

// 复制阶段只写新文件，不改文章；失败时可以安全删除已复制目标并恢复原文。
function preflightWrite(moves, plans) {
  for (const [sourcePath, move] of moves) {
    if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
      throw new Error(`源图片在规划后消失：${displayPath(sourcePath)}`);
    }
    if (existsSync(move.destinationPath)) {
      throw new Error(`目标图片在规划后出现，拒绝覆盖：${displayPath(move.destinationPath)}`);
    }
  }
  for (const plan of plans) {
    const current = readFileSync(plan.postFile, "utf8");
    if (current !== plan.content) {
      throw new Error(`文章在规划后发生变化，拒绝覆盖：${displayPath(plan.postFile)}`);
    }
  }
}

function verifyWrittenPosts(writtenPlans) {
  for (const plan of writtenPlans) {
    const current = readFileSync(plan.postFile, "utf8");
    if (current !== plan.nextContent) {
      throw new Error(`文章写入校验失败：${displayPath(plan.postFile)}`);
    }
  }
}

function rollbackMigration(createdDestinations, writtenPlans, journalPath) {
  const rollbackErrors = [];
  for (const plan of writtenPlans.slice().reverse()) {
    try {
      const current = readFileSync(plan.postFile, "utf8");
      if (current !== plan.content) writeFileSync(plan.postFile, plan.content, "utf8");
    } catch (error) {
      rollbackErrors.push(`恢复文章失败：${displayPath(plan.postFile)}（${error.message}）`);
    }
  }
  for (const destinationPath of createdDestinations.slice().reverse()) {
    try {
      if (existsSync(destinationPath)) unlinkSync(destinationPath);
      pruneEmptyDirectories(dirname(destinationPath), IMAGES_DIR);
    } catch (error) {
      rollbackErrors.push(`删除目标失败：${displayPath(destinationPath)}（${error.message}）`);
    }
  }
  if (rollbackErrors.length > 0) {
    console.error("自动回滚未完成：");
    for (const error of rollbackErrors) console.error(`  - ${error}`);
    console.error(`保留迁移日志，可据此手动恢复：${journalPath}`);
    return false;
  }
  if (!removeJournal(journalPath)) {
    console.warn(`自动回滚完成，但日志删除失败：${journalPath}`);
  } else {
    console.log("已回滚本次迁移，源文件和文章内容保持原状。");
  }
  return true;
}

const normalizedCustomNamespace = customNamespace ? normalizeCustomNamespace(customNamespace) : "";
const postFiles = collectPostFiles(inputs);
if (postFiles.length === 0) {
  fail("没有找到可处理的 Markdown 或 HTML 文章。");
}

const plans = [];
const errors = [];
const moves = new Map();
const moveOrigins = new Map();

for (const postFile of postFiles) {
  const content = readFileSync(postFile, "utf8");
  const unsupported = collectUnsupportedImageSyntax(content);
  if (unsupported.length > 0) {
    for (const issue of unsupported) {
      errors.push(`${displayPath(postFile)}: ${issue}`);
    }
    continue;
  }
  const namespace = getNamespace(postFile);
  const replacements = new Map();

  for (const rawTarget of collectReferences(content)) {
    try {
      const plan = planReference(postFile, namespace, rawTarget);
      if (!plan) continue;
      replacements.set(rawTarget, plan.destinationUrl);
      if (plan.needsMove) {
        const existingMove = moves.get(plan.sourcePath);
        if (existingMove && existingMove.destinationPath !== plan.destinationPath) {
          throw new Error(
            formatConflict(
              "同一张图片被规划到两个不同目标",
              [
                `图片：${displayPath(plan.sourcePath)}`,
                `来源 1：${displayPath(existingMove.postFile)} -> ${existingMove.rawTarget} => ${displayPath(existingMove.destinationPath)}`,
                `来源 2：${displayPath(postFile)} -> ${plan.rawTarget} => ${displayPath(plan.destinationPath)}`
              ],
              [
                "用 --to <子目录> 分批迁移，或把共享图片手动放到 assets/images/ 后改用绝对路径",
                "如果两篇文章确实要共用一张图，先手动决定唯一的 /assets/images/... 路径"
              ]
            )
          );
        }
        const existingSource = moveOrigins.get(plan.destinationPath);
        if (existingSource && existingSource.sourcePath !== plan.sourcePath) {
          throw new Error(
            formatConflict(
              `两张不同图片会迁到同一个目标：${displayRelativePath(plan.destinationRelative)}`,
              [
                `来源 1：${displayPath(existingSource.postFile)} -> ${existingSource.rawTarget}`,
                `来源 2：${displayPath(postFile)} -> ${plan.rawTarget}`,
                `目标：${displayPath(plan.destinationPath)}`
              ],
              [
                "重命名其中一张图片，或修改文章里的引用",
                `用 --to <子目录> 只迁移其中一篇，例如 --to ${namespace}/article-a`,
                "手动把其中一张图放到 assets/images/ 并写成 /assets/images/... 引用"
              ]
            )
          );
        }
        moves.set(plan.sourcePath, {
          destinationPath: plan.destinationPath,
          postDir: dirname(postFile),
          postFile,
          rawTarget: plan.rawTarget
        });
        moveOrigins.set(plan.destinationPath, {
          sourcePath: plan.sourcePath,
          postFile,
          rawTarget: plan.rawTarget
        });
      }
    } catch (error) {
      errors.push(`${displayPath(postFile)}: ${error.message}`);
    }
  }

  if (replacements.size > 0) {
    plans.push({ postFile, content, replacements });
  }
}

if (errors.length > 0) {
  console.error(`图片迁移失败，共 ${errors.length} 个错误：`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

if (moves.size === 0 && plans.length === 0) {
  console.log("没有发现需要迁移的相对图片引用。");
  process.exit(0);
}

console.log(`${write ? "执行" : "预览"}图片迁移：${moves.size} 个文件，${plans.length} 篇文章。`);
for (const [sourcePath, move] of moves) {
  console.log(`  移动 ${displayPath(sourcePath)} -> ${displayPath(move.destinationPath)}`);
}
for (const plan of plans) {
  for (const [rawTarget, destinationUrl] of plan.replacements) {
    console.log(`  改写 ${displayPath(plan.postFile)}: ${rawTarget} -> ${destinationUrl}`);
  }
}

if (!write) {
  console.log("未写入任何文件；确认后加 --write 执行。");
  process.exit(0);
}

try {
  preflightWrite(moves, plans);
} catch (error) {
  fail(error.message);
}

let journalPath;
try {
  journalPath = createJournal(moves, plans);
} catch (error) {
  fail(`无法创建迁移日志，未修改任何文件：${error.message}`);
}

const createdDestinations = [];
const writtenPlans = [];
const deletionErrors = [];
let deletedSources = 0;

try {
  // 第一阶段只复制图片，源文件保留；复制失败时可以直接删除新目标。
  for (const [sourcePath, move] of moves) {
    mkdirSync(dirname(move.destinationPath), { recursive: true });
    createdDestinations.push(move.destinationPath);
    copyFileSync(sourcePath, move.destinationPath);
  }

  // 第二阶段改写文章；写入前登记原文，任何一次写入失败都能整体恢复。
  for (const plan of plans) {
    const nextContent = rewriteCoverReference(
      rewriteImageReferences(plan.content, plan.replacements),
      plan.replacements
    );
    if (nextContent !== plan.content) {
      writtenPlans.push({ ...plan, nextContent });
      writeFileSync(plan.postFile, nextContent, "utf8");
    }
  }

  verifyWrittenPosts(writtenPlans);

  // 第三阶段才删除源文件；删除失败时文章已经指向新目标，站点不会断链。
  for (const [sourcePath, move] of moves) {
    try {
      unlinkSync(sourcePath);
      deletedSources += 1;
    } catch (error) {
      if (error.code !== "ENOENT") {
        deletionErrors.push(`删除源图片失败：${displayPath(sourcePath)}（${error.message}）`);
      }
    }
    pruneEmptyDirectories(dirname(sourcePath), move.postDir);
  }
} catch (error) {
  rollbackMigration(createdDestinations, writtenPlans, journalPath);
  console.error(`图片迁移失败：${error.message}`);
  process.exit(1);
}

if (deletionErrors.length > 0) {
  console.error("迁移正文已完成，但源文件清理失败：");
  for (const error of deletionErrors) console.error(`  - ${error}`);
  console.error(`保留迁移日志，确认后手动清理源文件：${journalPath}`);
  process.exit(1);
}

if (!removeJournal(journalPath)) {
  console.warn(`迁移已完成，但日志删除失败：${journalPath}`);
}
console.log(`图片迁移完成：复制 ${moves.size} 个文件，改写 ${writtenPlans.length} 篇文章，删除 ${deletedSources} 个源文件。`);
