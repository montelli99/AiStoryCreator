/**
 * View Mode Definitions & Theme Tokens
 * 4 complete design systems for the AI Creator Studio
 */

export type ViewMode = "vision" | "stripe" | "linear" | "tiktok";

export interface ThemeTokens {
  name: ViewMode;
  label: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentAlt: string;
    success: string;
    warning: string;
    error: string;
  };
  effects: {
    blur: string;
    shadow: string;
    shadowLg: string;
    glow: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSmoothing: string;
  };
}

export const THEME_TOKENS: Record<ViewMode, ThemeTokens> = {
  vision: {
    name: "vision",
    label: "Apple Vision Pro",
    description: "Glass, immersive, translucent",
    colors: {
      background: "rgba(10, 10, 15, 0.8)",
      surface: "rgba(255, 255, 255, 0.05)",
      surfaceAlt: "rgba(255, 255, 255, 0.08)",
      border: "rgba(255, 255, 255, 0.1)",
      text: "rgba(255, 255, 255, 0.95)",
      textMuted: "rgba(255, 255, 255, 0.6)",
      accent: "rgb(168, 85, 247)",
      accentAlt: "rgb(236, 72, 153)",
      success: "rgb(34, 197, 94)",
      warning: "rgb(251, 146, 60)",
      error: "rgb(239, 68, 68)",
    },
    effects: {
      blur: "blur(20px)",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      shadowLg: "0 20px 64px rgba(0, 0, 0, 0.2)",
      glow: "0 0 20px rgba(168, 85, 247, 0.3)",
    },
    radius: {
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSmoothing: "antialiased",
    },
  },

  stripe: {
    name: "stripe",
    label: "Stripe Dashboard",
    description: "Enterprise clean, minimal",
    colors: {
      background: "#ffffff",
      surface: "#f9fafb",
      surfaceAlt: "#f3f4f6",
      border: "#e5e7eb",
      text: "#111827",
      textMuted: "#6b7280",
      accent: "#0066cc",
      accentAlt: "#0052a3",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
    },
    effects: {
      blur: "blur(0px)",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      shadowLg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      glow: "none",
    },
    radius: {
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
    },
    typography: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontSmoothing: "subpixel-antialiased",
    },
  },

  linear: {
    name: "linear",
    label: "Notion/Linear Hybrid",
    description: "Ultra-minimal, modern",
    colors: {
      background: "#ffffff",
      surface: "#fafbfc",
      surfaceAlt: "#f5f6f7",
      border: "#e0e0e0",
      text: "#0a0a0a",
      textMuted: "#8b8b8b",
      accent: "#5e4fa2",
      accentAlt: "#3f3f99",
      success: "#4caf50",
      warning: "#ff9800",
      error: "#f44336",
    },
    effects: {
      blur: "blur(0px)",
      shadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      shadowLg: "0 4px 8px rgba(0, 0, 0, 0.08)",
      glow: "none",
    },
    radius: {
      sm: "3px",
      md: "4px",
      lg: "6px",
      xl: "8px",
    },
    typography: {
      fontFamily: "'Segoe UI', sans-serif",
      fontSmoothing: "antialiased",
    },
  },

  tiktok: {
    name: "tiktok",
    label: "TikTok Creator Suite",
    description: "Bold, neon, creator aesthetic",
    colors: {
      background: "#0a0e27",
      surface: "#1a1f3a",
      surfaceAlt: "#252d4a",
      border: "#3d4563",
      text: "#ffffff",
      textMuted: "#a0aec0",
      accent: "#ff0050",
      accentAlt: "#00d4ff",
      success: "#00ff88",
      warning: "#ffaa00",
      error: "#ff3333",
    },
    effects: {
      blur: "blur(10px)",
      shadow: "0 8px 24px rgba(255, 0, 80, 0.2)",
      shadowLg: "0 16px 48px rgba(255, 0, 80, 0.3)",
      glow: "0 0 30px rgba(255, 0, 80, 0.4)",
    },
    radius: {
      sm: "6px",
      md: "10px",
      lg: "14px",
      xl: "20px",
    },
    typography: {
      fontFamily: "'Poppins', -apple-system, sans-serif",
      fontSmoothing: "antialiased",
    },
  },
};

export const VIEW_MODES: Array<{ id: ViewMode; label: string }> = [
  { id: "vision", label: "Vision Pro" },
  { id: "stripe", label: "Stripe" },
  { id: "linear", label: "Linear" },
  { id: "tiktok", label: "TikTok" },
];

