// 主题切换脚本：night 是夜航深色，paper 是纸墨浅色；首帧初始值由 base.njk 内联脚本恢复。
// 这里负责手动切换、持久化、按钮无障碍状态，以及没有手动选择时跟随系统主题变化。
(function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const readStoredTheme = () => {
    try {
      return localStorage.getItem("site-theme");
    } catch (error) {
      return null;
    }
  };

  const applyTheme = (theme, persist) => {
    const label = theme === "paper" ? "切换到夜航深色主题" : "切换到纸墨浅色主题";
    root.dataset.theme = theme;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
    if (themeColor) themeColor.content = theme === "paper" ? "#f7f4ee" : "#0b0d14";
    if (!persist) return;
    try {
      localStorage.setItem("site-theme", theme);
    } catch (error) {
      // 隐私模式可能禁用存储；本次切换仍然生效，只是下次打开不再记住。
    }
  };

  applyTheme(root.dataset.theme === "paper" ? "paper" : "night", false);

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "paper" ? "night" : "paper";
    applyTheme(nextTheme, true);
  });

  systemQuery.addEventListener("change", (event) => {
    if (readStoredTheme()) return;
    applyTheme(event.matches ? "paper" : "night", false);
  });
})();
