import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // Gen Z Indigo / Electric Purple
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          50: "#fff1f2",
          100: "#ffe4e6",
          400: "#fb7185",
          500: "#f43f5e", // Rose accent for likes & highlights
          600: "#e11d48",
        },
        dark: {
          bg: "#0B0F19",       // Subtle deep navy/slate, not harsh pitch black
          card: "#111827",     // Soft elevated card background
          elevated: "#1F2937", // Border and hover states
          text: "#F3F4F6",     // Clear high contrast text
          muted: "#9CA3AF",    // Secondary readable text
        },
        light: {
          bg: "#F8FAFC",       // Soft off-white, easy on the eyes
          card: "#FFFFFF",
          elevated: "#F1F5F9",
          text: "#0F172A",
          muted: "#64748B",
        }
      },
      fontFamily: {
        sans: [
          "var(--font-lao)",
          "Noto Sans Lao",
          "Noto Sans Thai",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "like-bounce": "likeBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "scale-up": "scaleUp 0.2s ease-out",
        "fade-in": "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        likeBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.35)" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
