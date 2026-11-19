// CSDN 图床会按 Referer 拒绝站外引用；只对 CSDN 图片补 no-referrer，避免影响其他外链。
const IMG_TAG_PATTERN = /<img\b[^>]*>/gi;
const SRC_PATTERN = /\bsrc\s*=\s*(["'])(.*?)\1/i;
const REFERRER_PATTERN = /\breferrerpolicy\s*=/i;
const CSDN_HOST_PATTERN = /(^|\.)(?:csdnimg\.cn|csdn\.net)$/i;

export function isCsdnImageUrl(value) {
  const normalized = String(value || "").trim().replace(/&amp;/g, "&");
  if (!normalized) return false;
  try {
    const url = new URL(normalized, "https://example.invalid");
    return /^https?:$/.test(url.protocol) && CSDN_HOST_PATTERN.test(url.hostname);
  } catch (error) {
    return false;
  }
}

export function addCsdnReferrerPolicy(html) {
  if (!html) return html;
  return String(html).replace(IMG_TAG_PATTERN, (tag) => {
    if (REFERRER_PATTERN.test(tag)) return tag;
    const src = tag.match(SRC_PATTERN);
    if (!src || !isCsdnImageUrl(src[2])) return tag;
    return tag.replace(/\s*\/?>$/, (ending) => ` referrerpolicy="no-referrer"${ending}`);
  });
}
