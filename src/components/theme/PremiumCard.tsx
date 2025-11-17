"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";
import { ViewMode } from "@/lib/theme/view-modes";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export default function PremiumCard({
  children,
  className = "",
  interactive = false,
}: PremiumCardProps) {
  const { viewMode, tokens } = useTheme();

  const getCardStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.border}`,
      backgroundColor: tokens.colors.surface,
      transition: "all 0.3s ease",
    };

    switch (viewMode) {
      case "vision":
        return {
          ...baseStyles,
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
            },
          }),
        };

      case "stripe":
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.surface,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }),
        };

      case "linear":
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.surface,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              backgroundColor: tokens.colors.surfaceAlt,
            },
          }),
        };

      case "tiktok":
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.surface,
          boxShadow: `0 8px 24px rgba(255, 0, 80, 0.2)`,
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              boxShadow: `0 0 30px rgba(255, 0, 80, 0.4)`,
              backgroundColor: tokens.colors.surfaceAlt,
            },
          }),
        };

      default:
        return baseStyles;
    }
  };

  return (
    <div
      style={getCardStyles()}
      className={`p-6 ${interactive ? "hover:shadow-lg" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

