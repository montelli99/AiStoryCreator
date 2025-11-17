"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme/theme-context";
import { VIEW_MODES, ViewMode } from "@/lib/theme/view-modes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";

export default function ViewModeSwitcher() {
  const { viewMode, setViewMode, isLoading } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleModeChange = async (mode: ViewMode) => {
    await setViewMode(mode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          View Modes
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {VIEW_MODES.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => handleModeChange(mode.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{mode.label}</span>
            {viewMode === mode.id && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Current: <span className="font-semibold capitalize">{viewMode}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

