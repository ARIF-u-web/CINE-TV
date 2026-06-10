// Lightweight theme manager: 'dark' | 'light' | 'system'. Persisted in localStorage.
export type Theme = "dark" | "light" | "system";
const KEY = "cinetv:theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(KEY) as Theme) || "dark";
}

export function resolvedTheme(t: Theme = getTheme()): "dark" | "light" {
  if (t === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return t === "light" ? "light" : "dark";
}

export function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const r = resolvedTheme(t);
  const html = document.documentElement;
  html.classList.toggle("dark", r === "dark");
  html.classList.toggle("light", r === "light");
  html.style.colorScheme = r;
}

export function setTheme(t: Theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, t);
  applyTheme(t);
  window.dispatchEvent(new CustomEvent("cinetv:theme", { detail: t }));
}

export function initTheme() {
  if (typeof window === "undefined") return;
  applyTheme(getTheme());
  const mql = window.matchMedia("(prefers-color-scheme: light)");
  mql.addEventListener?.("change", () => { if (getTheme() === "system") applyTheme("system"); });
}
