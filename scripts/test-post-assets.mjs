// 构建期文章图片规划测试：覆盖根目录、子分类、资源包目录、路径改写和冲突检测。

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import {
  buildPostAssetPlans,
  createPostAssetPlan,
  getPostSubcategory,
  rewritePostImageReferences
} from "./post-assets.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertThrows(callback, pattern, message) {
  try {
    callback();
  } catch (error) {
    assert(pattern.test(error.message), `${message}：${error.message}`);
    return;
  }
  throw new Error(message);
}

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

const migrateScript = join(dirname(fileURLToPath(import.meta.url)), "migrate-post-assets.mjs");

function runMigrate(cwd, args) {
  return spawnSync(process.execPath, [migrateScript, ...args], {
    cwd,
    encoding: "utf8"
  });
}

const tempRoot = mkdtempSync(join(tmpdir(), "suhan-post-assets-"));
const postsDir = join(tempRoot, "src/content/posts");
const imagesDir = join(tempRoot, "assets/images");

try {
  const rootPost = join(postsDir, "demo.md");
  writeFile(
    rootPost,
    [
      "---",
      "title: Demo",
      "date: 2026-11-13",
      "slug: demo",
      "category: it",
      "status: published",
      "cover: ./cover.png",
      "---",
      "",
      "![root](.\\img\\a.png)",
      ""
    ].join("\n")
  );
  writeFile(join(postsDir, "img/a.png"), "root-image");
  writeFile(join(postsDir, "cover.png"), "root-cover");

  const gitPost = join(postsDir, "git/example.md");
  writeFile(
    gitPost,
    [
      "---",
      "title: Git Example",
      "date: 2026-11-13",
      "slug: git-example",
      "category: it",
      "status: published",
      "---",
      "",
      "![git](./pic/b.png)",
      ""
    ].join("\n")
  );
  writeFile(join(postsDir, "git/pic/b.png"), "git-image");

  const bundlePost = join(postsDir, "程序流程图/程序流程图.md");
  writeFile(
    bundlePost,
    [
      "---",
      "title: Flowchart",
      "date: 2026-11-13",
      "slug: lct",
      "category: it",
      "status: published",
      "---",
      "",
      "![flow](.\\符号.png)",
      ""
    ].join("\n")
  );
  writeFile(join(postsDir, "程序流程图/符号.png"), "flow-image");

  const rootPlan = createPostAssetPlan(rootPost, { postsDir, imagesDir });
  assert(rootPlan.namespace === "demo", "根目录文章应使用 slug 作为命名空间");
  assert(
    rootPlan.replacements.get("\\img\\a.png") === undefined,
    "反斜杠引用应按原始引用键进入替换表"
  );
  assert(
    rootPlan.replacements.get(".\\img\\a.png") === "/assets/images/demo/a.png",
    "反斜杠相对图片应改写为 assets/images 绝对路径"
  );
  assert(
    rootPlan.replacements.get("./cover.png") === "/assets/images/demo/cover.png",
    "相对 cover 应改写为 assets/images 绝对路径"
  );

  const gitPlan = createPostAssetPlan(gitPost, { postsDir, imagesDir });
  assert(gitPlan.namespace === "git", "合法子分类目录应继续作为命名空间");
  assert(
    gitPlan.replacements.get("./pic/b.png") === "/assets/images/git/b.png",
    "子分类图片应落到子分类目录"
  );

  const bundlePlan = createPostAssetPlan(bundlePost, { postsDir, imagesDir });
  assert(bundlePlan.namespace === "lct", "非 slug 目录应回退到 front matter slug");
  assert(
    bundlePlan.replacements.get(".\\符号.png") === "/assets/images/lct/符号.png",
    "资源包目录中的中文图片应正常规划"
  );
  assert(getPostSubcategory(bundlePost, postsDir) === "", "资源包目录不应派生子分类");

  const rewritten = rewritePostImageReferences(
    [
      "---",
      "cover: ./cover.png",
      "---",
      "",
      "![root](.\\img\\a.png)",
      ""
    ].join("\n"),
    new Map([
      ["./cover.png", "/assets/images/demo/cover.png"],
      [".\\img\\a.png", "/assets/images/demo/a.png"]
    ])
  );
  assert(
    rewritten.includes("cover: /assets/images/demo/cover.png"),
    "front matter cover 应被改写"
  );
  assert(
    rewritten.includes("![root](/assets/images/demo/a.png)"),
    "正文图片应被改写"
  );
  assert(!rewritten.includes("\\"), "改写结果不应残留反斜杠");

  const allPlans = buildPostAssetPlans({
    postsDir,
    imagesDir,
    postFiles: [rootPost, gitPost, bundlePost]
  });
  assert(allPlans.plans.size === 3, "三篇文章都应有图片规划");
  assert(allPlans.copies.size === 4, "四个相对图片应登记为输出复制项");

  const conflictOne = join(postsDir, "git/one.md");
  const conflictTwo = join(postsDir, "git/two.md");
  writeFile(
    conflictOne,
    "---\ntitle: One\ndate: 2026-11-13\nslug: one\ncategory: it\nstatus: published\n---\n\n![one](./one/same.png)\n"
  );
  writeFile(
    conflictTwo,
    "---\ntitle: Two\ndate: 2026-11-13\nslug: two\ncategory: it\nstatus: published\n---\n\n![two](./two/same.png)\n"
  );
  writeFile(join(postsDir, "git/one/same.png"), "one-image");
  writeFile(join(postsDir, "git/two/same.png"), "two-image");
  assertThrows(
    () => buildPostAssetPlans({ postsDir, imagesDir, postFiles: [conflictOne, conflictTwo] }),
    /复制到同一目标/,
    "同命名空间同名图片应报冲突"
  );

  const missingPost = join(postsDir, "missing.md");
  writeFile(
    missingPost,
    "---\ntitle: Missing\ndate: 2026-11-13\nslug: missing\ncategory: it\nstatus: published\n---\n\n![missing](./missing.png)\n"
  );
  assertThrows(
    () => createPostAssetPlan(missingPost, { postsDir, imagesDir }),
    /相对图片不存在/,
    "缺失图片应 fail-fast"
  );

  const cliRoot = mkdtempSync(join(tmpdir(), "suhan-assets-sync-"));
  const crossRoot = mkdtempSync(join(tmpdir(), "suhan-assets-cross-"));
  try {
    const cliPost = join(cliRoot, "src/content/posts/bundle/post.md");
    const cliImage = join(cliRoot, "src/content/posts/bundle/a.png");
    writeFile(
      cliPost,
      "---\ntitle: CLI\ndate: 2026-11-13\nslug: cli-asset\ncategory: it\nstatus: published\n---\n\n![a](./a.png)\n"
    );
    writeFile(cliImage, "cli-image");

    const firstRun = runMigrate(cliRoot, ["--all", "--write"]);
    assert(firstRun.status === 0, `全量同步首次执行失败：${firstRun.stderr || firstRun.stdout}`);
    assert(
      existsSync(join(cliRoot, "assets/images/bundle/a.png")),
      "全量同步应把图片复制到规范位置"
    );
    assert(!existsSync(cliImage), "全量同步成功后应删除源图片");
    const rewrittenPost = readFileSync(cliPost, "utf8");
    assert(
      rewrittenPost.includes("![a](/assets/images/bundle/a.png)"),
      "全量同步应改写 Markdown 图片地址"
    );

    const secondRun = runMigrate(cliRoot, ["--all", "--write"]);
    assert(secondRun.status === 0, `全量同步第二次执行失败：${secondRun.stderr || secondRun.stdout}`);
    assert(
      readFileSync(cliPost, "utf8") === rewrittenPost,
      "全量同步应保持幂等，不重复改写文章"
    );

    const crossPost = join(crossRoot, "src/content/posts/a/a.md");
    const crossImage = join(crossRoot, "src/content/posts/shared/x.png");
    writeFile(
      crossPost,
      "---\ntitle: Cross\ndate: 2026-11-13\nslug: cross-asset\ncategory: it\nstatus: published\n---\n\n![x](../shared/x.png)\n"
    );
    writeFile(crossImage, "cross-image");
    const crossRun = runMigrate(crossRoot, ["--all", "--write"]);
    assert(crossRun.status !== 0, "跨文章目录图片引用必须报错");
    assert(
      `${crossRun.stderr}${crossRun.stdout}`.includes("当前文章目录内"),
      "跨文章目录错误应明确说明边界"
    );
    assert(existsSync(crossImage), "跨文章目录失败时不能删除源图片");
  } finally {
    rmSync(cliRoot, { recursive: true, force: true });
    rmSync(crossRoot, { recursive: true, force: true });
  }

  console.log("文章图片规划与迁移测试通过。");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
