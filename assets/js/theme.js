// 主题选择脚本：night、paper、nocturne、nocturne-bright 四套色板。
// 这里负责手动选择、持久化、按钮状态、系统主题跟随和菜单关闭。
(function initThemePicker() {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const picker = document.querySelector("[data-theme-picker]");
  const options = Array.from(document.querySelectorAll("[data-theme-option]"));
  if (!toggle || !picker || options.length === 0) return;

  const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeColors = {
    night: "#0b0d14",
    paper: "#f7f4ee",
    nocturne: "#211d25",
    "nocturne-bright": "#fbf8ff"
  };
  const themeLabels = {
    night: "夜航深色",
    paper: "纸墨浅色",
    nocturne: "Nocturne 深色",
    "nocturne-bright": "Nocturne Bright"
  };

  const readStoredTheme = () => {
    try {
      return localStorage.getItem("site-theme");
    } catch (error) {
      return null;
    }
  };

  const normalizeTheme = (theme) => {
    return Object.prototype.hasOwnProperty.call(themeColors, theme) ? theme : null;
  };

  const applyTheme = (theme, persist) => {
    const nextTheme = normalizeTheme(theme) || "night";
    root.dataset.theme = nextTheme;
    for (const option of options) {
      const active = option.dataset.themeOption === nextTheme;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-pressed", String(active));
    }

    const label = `选择主题，当前${themeLabels[nextTheme]}`;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
    if (themeColor) themeColor.content = themeColors[nextTheme];
    if (!persist) return;
    try {
      localStorage.setItem("site-theme", nextTheme);
    } catch (error) {
      // 隐私模式可能禁用存储；本次选择仍然生效，只是下次打开不再记住。
    }
  };

  applyTheme(root.dataset.theme, false);

  for (const option of options) {
    option.addEventListener("click", () => {
      applyTheme(option.dataset.themeOption, true);
      picker.open = false;
      toggle.focus();
    });
  }

  systemQuery.addEventListener("change", (event) => {
    if (readStoredTheme()) return;
    applyTheme(event.matches ? "paper" : "night", false);
  });

  document.addEventListener("click", (event) => {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && picker.open) {
      picker.open = false;
      toggle.focus();
    }
  });
})();
