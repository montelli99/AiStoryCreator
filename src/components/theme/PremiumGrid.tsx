"use client";

import React from "react";
import { useTheme } from "@/lib/theme/theme-context";

interface PremiumGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export default function PremiumGrid({
  children,
  columns = 3,
  gap = 24,
  className = "",
}: PremiumGridProps) {
  const { viewMode } = useTheme();

  const getGridStyles = (): React.CSSProperties => {
    let gridCols = `repeat(${columns}, 1fr)`;

    // Responsive columns based on view mode
    switch (viewMode) {
      case "vision":
        gridCols = `repeat(auto-fit, minmax(300px, 1fr))`;
        break;
      case "stripe":
        gridCols = `repeat(auto-fit, minmax(280px, 1fr))`;
        break;
      case "linear":
        gridCols = `repeat(auto-fit, minmax(250px, 1fr))`;
        break;
      case "tiktok":
        gridCols = `repeat(auto-fit, minmax(320px, 1fr))`;
        break;
    }

    return {
      display: "grid",
      gridTemplateColumns: gridCols,
      gap: `${gap}px`,
      width: "100%",
    };
  };

  return (
    <div style={getGridStyles()} className={className}>
      {children}
    </div>
  );
}

