// 图片外链策略测试：确认只给 CSDN 图片补 no-referrer，本地图和其他图床不受影响。
import assert from "node:assert/strict";
import { addCsdnReferrerPolicy, isCsdnImageUrl } from "./csdn-image-policy.mjs";

assert.equal(isCsdnImageUrl("https://img-blog.csdnimg.cn/a.png"), true);
assert.equal(isCsdnImageUrl("https://i-blog.csdnimg.cn/direct/a.png"), true);
assert.equal(isCsdnImageUrl("https://img-blog.csdn.net/a.png"), true);
assert.equal(isCsdnImageUrl("https://www.runoob.com/a.png"), false);
assert.equal(isCsdnImageUrl("/assets/images/example.png"), false);

const html = [
  '<p><img src="https://i-blog.csdnimg.cn/a.png" alt="a"></p>',
  '<img src="https://www.runoob.com/b.png" alt="b">',
  '<img src="https://img-blog.csdnimg.cn/c.png" referrerpolicy="origin">',
  '<img src="/assets/images/local.png" alt="local">'
].join("");
const output = addCsdnReferrerPolicy(html);

assert.match(output, /https:\/\/i-blog\.csdnimg\.cn\/a\.png" alt="a" referrerpolicy="no-referrer">/);
assert.ok(!output.includes('www.runoob.com/b.png" alt="b" referrerpolicy'));
assert.ok(output.includes('https://img-blog.csdnimg.cn/c.png" referrerpolicy="origin"'));
assert.ok(!output.includes('/assets/images/local.png" alt="local" referrerpolicy'));

console.log("图片外链策略测试通过：仅 CSDN 图片注入 no-referrer。");
