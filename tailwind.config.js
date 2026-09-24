/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B1016",
          surface: "#111B26",
        },
        paper: {
          DEFAULT: "#F5F6F3",
          surface: "#FFFFFF",
        },
        ink: "#F3F7FB",
        muted: "#A9B6C5",
        line: "rgba(255,255,255,0.12)",
        accent: {
          project: "#5EEAD4",
          cert: "#F7C86B",
          badge: "#C8B6FF",
          vibe: "#A3E635",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};
