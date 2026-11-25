// 图片外链策略测试：确认只给已知防盗链图床补 no-referrer，本地图和其他图床不受影响。
import assert from "node:assert/strict";
import { addHotlinkReferrerPolicy, isHotlinkBlockedImageUrl } from "./remote-image-policy.mjs";

assert.equal(isHotlinkBlockedImageUrl("https://img-blog.csdnimg.cn/a.png"), true);
assert.equal(isHotlinkBlockedImageUrl("https://i-blog.csdnimg.cn/direct/a.png"), true);
assert.equal(isHotlinkBlockedImageUrl("https://img-blog.csdn.net/a.png"), true);
assert.equal(isHotlinkBlockedImageUrl("https://img2024.cnblogs.com/a.png"), true);
assert.equal(isHotlinkBlockedImageUrl("https://segmentfault.com/img/remote/a.png"), true);
assert.equal(isHotlinkBlockedImageUrl("https://www.runoob.com/a.png"), false);
assert.equal(isHotlinkBlockedImageUrl("/assets/images/example.png"), false);

const html = [
  '<p><img src="https://i-blog.csdnimg.cn/a.png" alt="a"></p>',
  '<img src="https://segmentfault.com/img/remote/b.png" alt="segmentfault">',
  '<img src="https://img2024.cnblogs.com/c.png" alt="cnblogs">',
  '<img src="https://www.runoob.com/b.png" alt="b">',
  '<img src="https://img-blog.csdnimg.cn/c.png" referrerpolicy="origin">',
  '<img src="/assets/images/local.png" alt="local">'
].join("");
const output = addHotlinkReferrerPolicy(html);

assert.match(output, /https:\/\/i-blog\.csdnimg\.cn\/a\.png" alt="a" referrerpolicy="no-referrer">/);
assert.match(output, /segmentfault\.com\/img\/remote\/b\.png" alt="segmentfault" referrerpolicy="no-referrer"/);
assert.match(output, /img2024\.cnblogs\.com\/c\.png" alt="cnblogs" referrerpolicy="no-referrer"/);
assert.ok(!output.includes('www.runoob.com/b.png" alt="b" referrerpolicy'));
assert.ok(output.includes('https://img-blog.csdnimg.cn/c.png" referrerpolicy="origin"'));
assert.ok(!output.includes('/assets/images/local.png" alt="local" referrerpolicy'));

console.log("图片外链策略测试通过：仅已知防盗链图床注入 no-referrer。");
