// 主题选择脚本：从 base.njk 输出的主题配置读取四套色板。
// 这里负责手动选择、持久化、按钮状态、系统主题跟随和菜单关闭。
(function initThemePicker() {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const picker = document.querySelector("[data-theme-picker]");
  const options = Array.from(document.querySelectorAll("[data-theme-option]"));
  const configElement = document.getElementById("theme-config");
  if (!toggle || !picker || options.length === 0 || !configElement) return;

  const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeConfig = JSON.parse(configElement.textContent);
  const themeColors = Object.fromEntries(themeConfig.map(theme => [theme.id, theme.color]));
  const themeLabels = Object.fromEntries(themeConfig.map(theme => [theme.id, theme.label]));
  const defaultThemeForScheme = (scheme) => {
    return themeConfig.find(theme => theme.scheme === scheme && theme.default)?.id || themeConfig[0].id;
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
    const nextTheme = normalizeTheme(theme) || themeConfig[0].id;
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
    applyTheme(defaultThemeForScheme(event.matches ? "light" : "dark"), false);
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
