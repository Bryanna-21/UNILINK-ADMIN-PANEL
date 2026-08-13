"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } =
    useTheme();

  return (
    <button
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }
      className="
      glass
      p-3
      rounded-xl
    "
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
