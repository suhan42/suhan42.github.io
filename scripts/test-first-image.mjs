// 首图提取回归测试：覆盖正常图片、注释、代码文本、data/blob 和属性边界。
import assert from "node:assert/strict";
import { firstImage } from "./first-image.mjs";

const cases = [
  ["双引号首图", '<p>正文</p><img src="/assets/images/a.png" alt="A">', "/assets/images/a.png"],
  ["单引号首图", "<img alt='A' src='/assets/images/b.png'>", "/assets/images/b.png"],
  ["跳过注释", '<!-- <img src="/assets/images/comment.png"> --><img src="/assets/images/c.png">', "/assets/images/c.png"],
  ["忽略代码文本", '<pre><code>&lt;img src="/assets/images/code.png"&gt;</code></pre>', ""],
  ["跳过 data 后继续", '<img src="data:image/png;base64,abc"><img src="/assets/images/d.png">', "/assets/images/d.png"],
  ["跳过 blob", '<img src="blob:https://example.com/id">', ""],
  ["不匹配 data-src", '<img data-src="/assets/images/lazy.png">', ""],
  ["解码查询分隔符", '<img SRC="/assets/images/e.png?a=1&amp;b=2">', "/assets/images/e.png?a=1&b=2"],
  ["无图", "<p>纯文字</p>", ""]
];

let failed = 0;
for (const [name, source, expected] of cases) {
  const actual = firstImage(source);
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL ${name}: 期望 "${expected}"，实际 "${actual}"`);
  } else {
    console.log(`PASS ${name}`);
  }
}

assert.equal(failed, 0, `首图提取测试失败 ${failed} 项`);
console.log(`首图提取测试通过：${cases.length} 项。`);
