export const SETTINGS_KEYS = {
  displayName: "aseel-display-name",
  theme: "theme",
  fontSize: "aseel-font-size",
  defaultStyle: "aseel-default-style",
};

export const FONT_SIZE_CLASSES = {
  sm: "font-size-sm",
  md: "font-size-md",
  lg: "font-size-lg",
};

export function getDisplayName(fallback = "User") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(SETTINGS_KEYS.displayName) || fallback;
}

export function setDisplayName(name) {
  localStorage.setItem(SETTINGS_KEYS.displayName, name);
  dispatchSettingsChange();
}

export function getTheme() {
  if (typeof window === "undefined") return "system";
  return localStorage.getItem(SETTINGS_KEYS.theme) || "system";
}

export function applyTheme(theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark");

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  }

  localStorage.setItem(SETTINGS_KEYS.theme, theme);
  dispatchSettingsChange();
}

export function getFontSize() {
  if (typeof window === "undefined") return "md";
  return localStorage.getItem(SETTINGS_KEYS.fontSize) || "md";
}

export function applyFontSize(size) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  Object.values(FONT_SIZE_CLASSES).forEach((c) => root.classList.remove(c));
  root.classList.add(FONT_SIZE_CLASSES[size] || FONT_SIZE_CLASSES.md);
  localStorage.setItem(SETTINGS_KEYS.fontSize, size);
  dispatchSettingsChange();
}

export function getDefaultStyle() {
  if (typeof window === "undefined") return "plain";
  return localStorage.getItem(SETTINGS_KEYS.defaultStyle) || "plain";
}

export function setDefaultStyle(style) {
  localStorage.setItem(SETTINGS_KEYS.defaultStyle, style);
  dispatchSettingsChange();
}

export function dispatchSettingsChange() {
  window.dispatchEvent(new Event("aseel-settings-change"));
}

export function initFontSize() {
  applyFontSize(getFontSize());
}
