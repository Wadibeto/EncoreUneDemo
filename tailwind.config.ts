import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: { 50: "#f8f6ed", 100: "#eeecdf", 200: "#dddacb", 300: "#c3c3b4", 400: "#a4a796", 500: "#898e7c", 600: "#666d5a", 700: "#454c3c", 800: "#2b3126", 900: "#1c2119", 950: "#11150f" },
        violet: { 50: "#faf6ea", 100: "#f4ebd4", 200: "#e7d6af", 300: "#d9c18e", 400: "#cab079", 500: "#b39961", 600: "#947d4d", 700: "#76623b", 800: "#57492e", 900: "#3e3522", 950: "#251f14" },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        muted: "hsl(var(--muted))",
        primary: "hsl(var(--primary))",
        border: "hsl(var(--border))",
        danger: "hsl(var(--danger))",
      },
      boxShadow: { glow: "0 0 40px rgba(188, 163, 105, .12)" },
      backgroundImage: { grid: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)" },
    },
  },
  plugins: [],
} satisfies Config;
