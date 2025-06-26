"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center p-2 rounded-full ${theme === "light" ? "bg-white text-black shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center p-2 rounded-full ${theme === "dark" ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex items-center justify-center p-2 rounded-full ${theme === "system" ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        aria-label="System preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}