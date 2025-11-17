"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ViewMode, THEME_TOKENS, ThemeTokens } from "./view-modes";

interface ThemeContextType {
  viewMode: ViewMode;
  tokens: ThemeTokens;
  setViewMode: (mode: ViewMode) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("vision");
  const [tokens, setTokens] = useState(THEME_TOKENS.vision);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved view mode from DB on mount
  useEffect(() => {
    const loadViewMode = async () => {
      try {
        const res = await fetch("/api/user/view-mode");
        if (res.ok) {
          const data = await res.json();
          const mode = data.viewMode as ViewMode;
          setViewModeState(mode);
          setTokens(THEME_TOKENS[mode]);
        }
      } catch (err) {
        console.error("Failed to load view mode:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadViewMode();
  }, []);

  const setViewMode = async (mode: ViewMode) => {
    setIsLoading(true);
    try {
      // Save to DB
      const res = await fetch("/api/user/view-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewMode: mode }),
      });

      if (res.ok) {
        setViewModeState(mode);
        setTokens(THEME_TOKENS[mode]);
        // Apply theme to document
        applyThemeToDocument(mode);
      }
    } catch (err) {
      console.error("Failed to save view mode:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply theme CSS variables to document
  useEffect(() => {
    applyThemeToDocument(viewMode);
  }, [viewMode]);

  return (
    <ThemeContext.Provider value={{ viewMode, tokens, setViewMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function applyThemeToDocument(mode: ViewMode) {
  const tokens = THEME_TOKENS[mode];
  const root = document.documentElement;

  // Set CSS variables
  root.style.setProperty("--bg-primary", tokens.colors.background);
  root.style.setProperty("--bg-surface", tokens.colors.surface);
  root.style.setProperty("--bg-surface-alt", tokens.colors.surfaceAlt);
  root.style.setProperty("--border-color", tokens.colors.border);
  root.style.setProperty("--text-primary", tokens.colors.text);
  root.style.setProperty("--text-muted", tokens.colors.textMuted);
  root.style.setProperty("--accent-primary", tokens.colors.accent);
  root.style.setProperty("--accent-alt", tokens.colors.accentAlt);
  root.style.setProperty("--color-success", tokens.colors.success);
  root.style.setProperty("--color-warning", tokens.colors.warning);
  root.style.setProperty("--color-error", tokens.colors.error);

  root.style.setProperty("--effect-blur", tokens.effects.blur);
  root.style.setProperty("--effect-shadow", tokens.effects.shadow);
  root.style.setProperty("--effect-shadow-lg", tokens.effects.shadowLg);
  root.style.setProperty("--effect-glow", tokens.effects.glow);

  root.style.setProperty("--radius-sm", tokens.radius.sm);
  root.style.setProperty("--radius-md", tokens.radius.md);
  root.style.setProperty("--radius-lg", tokens.radius.lg);
  root.style.setProperty("--radius-xl", tokens.radius.xl);

  root.style.setProperty("--font-family", tokens.typography.fontFamily);
  root.style.setProperty("--font-smoothing", tokens.typography.fontSmoothing);

  // Add data attribute for CSS selectors
  root.setAttribute("data-theme", mode);
}

