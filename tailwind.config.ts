import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        border: "var(--border)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          bright: "var(--accent-bright)",
        },
        warn: "var(--warn)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      fontFamily: {
        // Aliased to the same font as body text — the mobile app has
        // no separate display face, just the platform system font
        // throughout. Keeping this key (rather than removing it)
        // means every existing font-display usage across the app
        // becomes plain sans-serif automatically, without needing to
        // hunt down and edit every component that references it.
        display: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },

  plugins: [],
};

export default config;
