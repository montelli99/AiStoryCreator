/**
 * Theme Store - Client-side theme management
 */

import { ViewMode, THEME_TOKENS } from "./view-modes";

const STORAGE_KEY = "ai-creator-view-mode";

export class ThemeStore {
  static getLocalViewMode(): ViewMode {
    if (typeof window === "undefined") return "vision";
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ViewMode) || "vision";
  }

  static setLocalViewMode(mode: ViewMode): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, mode);
  }

  static getThemeTokens(mode: ViewMode) {
    return THEME_TOKENS[mode];
  }

  static getCSSVariables(mode: ViewMode) {
    const tokens = THEME_TOKENS[mode];
    return {
      "--bg-primary": tokens.colors.background,
      "--bg-surface": tokens.colors.surface,
      "--bg-surface-alt": tokens.colors.surfaceAlt,
      "--border-color": tokens.colors.border,
      "--text-primary": tokens.colors.text,
      "--text-muted": tokens.colors.textMuted,
      "--accent-primary": tokens.colors.accent,
      "--accent-alt": tokens.colors.accentAlt,
      "--color-success": tokens.colors.success,
      "--color-warning": tokens.colors.warning,
      "--color-error": tokens.colors.error,
      "--effect-blur": tokens.effects.blur,
      "--effect-shadow": tokens.effects.shadow,
      "--effect-shadow-lg": tokens.effects.shadowLg,
      "--effect-glow": tokens.effects.glow,
      "--radius-sm": tokens.radius.sm,
      "--radius-md": tokens.radius.md,
      "--radius-lg": tokens.radius.lg,
      "--radius-xl": tokens.radius.xl,
      "--font-family": tokens.typography.fontFamily,
      "--font-smoothing": tokens.typography.fontSmoothing,
    };
  }

  static applyTheme(mode: ViewMode): void {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const cssVars = this.getCSSVariables(mode);

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.setAttribute("data-theme", mode);
    this.setLocalViewMode(mode);
  }

  static getThemeClass(mode: ViewMode): string {
    return `theme-${mode}`;
  }
}

export default ThemeStore;

