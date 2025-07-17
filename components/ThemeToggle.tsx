"use client";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle dark/light mode"
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        background: theme === "dark" ? "#282a2c" : "#e3e3e3",
        color: theme === "dark" ? "#e3e3e3" : "#282a2c",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
