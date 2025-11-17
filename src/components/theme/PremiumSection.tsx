"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";

interface PremiumSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function PremiumSection({
  children,
  title,
  subtitle,
  className = "",
}: PremiumSectionProps) {
  const { viewMode, tokens } = useTheme();

  const getSectionStyles = (): React.CSSProperties => {
    switch (viewMode) {
      case "vision":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderRadius: tokens.radius.xl,
          padding: "32px",
          backdropFilter: "blur(10px)",
          border: `1px solid ${tokens.colors.border}`,
        };

      case "stripe":
        return {
          backgroundColor: tokens.colors.background,
          borderRadius: tokens.radius.lg,
          padding: "32px",
          border: `1px solid ${tokens.colors.border}`,
        };

      case "linear":
        return {
          backgroundColor: tokens.colors.background,
          borderRadius: tokens.radius.md,
          padding: "24px",
          border: "none",
        };

      case "tiktok":
        return {
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          padding: "32px",
          border: `1px solid ${tokens.colors.border}`,
          boxShadow: `0 0 20px rgba(255, 0, 80, 0.1)`,
        };

      default:
        return {};
    }
  };

  const getTitleStyles = (): React.CSSProperties => {
    switch (viewMode) {
      case "vision":
        return {
          fontSize: "28px",
          fontWeight: "600",
          color: tokens.colors.text,
          marginBottom: "8px",
        };

      case "stripe":
        return {
          fontSize: "24px",
          fontWeight: "600",
          color: tokens.colors.text,
          marginBottom: "8px",
        };

      case "linear":
        return {
          fontSize: "20px",
          fontWeight: "600",
          color: tokens.colors.text,
          marginBottom: "4px",
        };

      case "tiktok":
        return {
          fontSize: "28px",
          fontWeight: "700",
          background: `linear-gradient(135deg, ${tokens.colors.accent}, ${tokens.colors.accentAlt})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "8px",
        };

      default:
        return {};
    }
  };

  return (
    <section style={getSectionStyles()} className={className}>
      {title && (
        <div>
          <h2 style={getTitleStyles()}>{title}</h2>
          {subtitle && (
            <p
              style={{
                color: tokens.colors.textMuted,
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

