"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 items-center justify-center rounded-full border border-border/70 bg-white/60 px-3 text-sm font-medium text-foreground shadow-sm backdrop-blur dark:bg-white/5"
      aria-label="Toggle theme"
    >
      <span className="relative mr-2 flex h-5 w-5 items-center justify-center">
        <SunMedium className={`absolute h-4 w-4 transition-all ${isDark ? "scale-75 opacity-0" : "scale-100 opacity-100"}`} />
        <MoonStar className={`absolute h-4 w-4 transition-all ${isDark ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} />
      </span>
      {isDark ? "Night" : "Day"}
    </button>
  );
}

