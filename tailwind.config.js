/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "#1e40af",
          dark: "#1e3a8a",
        },
        accent: {
          DEFAULT: "#60a5fa",
          dark: "#3b82f6",
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        background: {
          DEFAULT: "#ffffff",
          dark: "#0f172a",
        },
        surface: {
          DEFAULT: "#f8fafc",
          dark: "#1e293b",
        },
        text: {
          DEFAULT: "#1e293b",
          dark: "#f1f5f9",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        vazir: ["Vazir", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
