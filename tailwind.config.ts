import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0e1117",
          raised: "#141922",
          border: "rgba(255,255,255,0.07)",
        },
        platform: {
          github: "#9a6ee3",
          leetcode: "#f89f1b",
          codeforces: "#3466b7",
          gfg: "#2f8d46",
          linkedin: "#0A66C2",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)"],
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      boxShadow: {
        card: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.07)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseBorder: {
          "0%, 100%": { boxShadow: "0 20px 60px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.08)" },
          "50%": { boxShadow: "0 24px 70px rgba(0,0,0,0.56), 0 0 0 1px rgba(248,159,27,0.45)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        pulseBorder: "pulseBorder 2.8s ease-in-out infinite",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
