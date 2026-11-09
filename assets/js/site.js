// 站点交互脚本：只保留 header 状态、移动菜单、文章目录折叠和跳转主内容等轻量行为。
// 不使用 jQuery、hc-mobile-nav 和 Bootstrap bundle，基础页面不再加载旧库。
(function initSiteBehavior() {
  "use strict";

  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-stuck", window.scrollY > 16);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  const mobileNav = document.querySelector(".mobile-nav");
  if (mobileNav) {
    mobileNav.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) mobileNav.removeAttribute("open");
    });

    document.addEventListener("click", (event) => {
      if (mobileNav.open && !mobileNav.contains(event.target)) mobileNav.removeAttribute("open");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNav.open) mobileNav.removeAttribute("open");
    });

    // 从移动菜单跳转到当前页时，关闭折叠面板，避免返回后菜单仍展开。
    window.addEventListener("pageshow", () => {
      mobileNav.removeAttribute("open");
    });
  }

  const toc = document.querySelector(".post-toc");
  if (toc) {
    const articleLayout = toc.closest(".post-layout");
    const compactToc = window.matchMedia("(max-width: 1180px)");
    const syncTocState = () => {
      articleLayout?.classList.toggle("toc-collapsed", !compactToc.matches && !toc.open);
      const label = toc.open ? "收起文章目录" : "展开文章目录";
      toc.querySelector("summary")?.setAttribute("aria-label", label);
    };
    toc.addEventListener("toggle", syncTocState);
    compactToc.addEventListener("change", syncTocState);
    if (compactToc.matches) toc.removeAttribute("open");
    syncTocState();
    toc.addEventListener("click", (event) => {
      if (event.target.closest("a") && compactToc.matches) toc.removeAttribute("open");
    });

    const tocTargets = Array.from(toc.querySelectorAll('a[href^="#"]'))
      .map((link) => {
        const id = decodeURIComponent(link.getAttribute("href").slice(1));
        return { link, heading: document.getElementById(id) };
      })
      .filter((target) => target.heading);

    if (tocTargets.length > 0) {
      let framePending = false;
      const updateActiveToc = () => {
        let current = tocTargets[0];
        for (const target of tocTargets) {
          if (target.heading.getBoundingClientRect().top <= 96) current = target;
          else break;
        }
        for (const target of tocTargets) {
          const active = target === current;
          target.link.classList.toggle("is-active", active);
          if (active) target.link.setAttribute("aria-current", "location");
          else target.link.removeAttribute("aria-current");
        }
        framePending = false;
      };
      const requestActiveUpdate = () => {
        if (framePending) return;
        framePending = true;
        window.requestAnimationFrame(updateActiveToc);
      };
      window.addEventListener("scroll", requestActiveUpdate, { passive: true });
      window.addEventListener("resize", requestActiveUpdate);
      updateActiveToc();
    }
  }

  const skipLink = document.querySelector(".visually-hidden[href='#main']");
  if (skipLink) {
    skipLink.addEventListener("click", () => {
      const main = document.querySelector("#main");
      if (main) main.focus();
    });
  }
})();
