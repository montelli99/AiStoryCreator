"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";

interface PremiumBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export default function PremiumBadge({
  children,
  variant = "default",
  className = "",
}: PremiumBadgeProps) {
  const { viewMode, tokens } = useTheme();

  const getColorForVariant = () => {
    switch (variant) {
      case "success":
        return tokens.colors.success;
      case "warning":
        return tokens.colors.warning;
      case "error":
        return tokens.colors.error;
      default:
        return tokens.colors.accent;
    }
  };

  const getBadgeStyles = (): React.CSSProperties => {
    const color = getColorForVariant();

    switch (viewMode) {
      case "vision":
        return {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 12px",
          borderRadius: tokens.radius.md,
          backgroundColor: `${color}20`,
          color: color,
          fontSize: "12px",
          fontWeight: "600",
          border: `1px solid ${color}40`,
          backdropFilter: "blur(10px)",
        };

      case "stripe":
        return {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 10px",
          borderRadius: tokens.radius.sm,
          backgroundColor: `${color}10`,
          color: color,
          fontSize: "12px",
          fontWeight: "600",
          border: `1px solid ${color}30`,
        };

      case "linear":
        return {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 8px",
          borderRadius: tokens.radius.sm,
          backgroundColor: `${color}15`,
          color: color,
          fontSize: "11px",
          fontWeight: "600",
          border: "none",
        };

      case "tiktok":
        return {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 14px",
          borderRadius: tokens.radius.md,
          backgroundColor: `${color}30`,
          color: color,
          fontSize: "12px",
          fontWeight: "700",
          border: `1px solid ${color}60`,
          boxShadow: `0 0 12px ${color}40`,
        };

      default:
        return {};
    }
  };

  return (
    <span style={getBadgeStyles()} className={className}>
      {children}
    </span>
  );
}

