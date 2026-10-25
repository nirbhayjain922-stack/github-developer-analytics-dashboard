/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        github: {
          bg: "#0d1117",
          canvas: "#010409",
          card: "#161b22",
          border: "#30363d",
          muted: "#8b949e",
          text: "#e6edf3",
          link: "#58a6ff",
          success: "#3fb950",
          danger: "#f85149",
          warning: "#d29922",
        },
      },
      fontFamily: {
        sans: [
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 24px rgba(1, 4, 9, 0.45)",
      },
    },
  },
  plugins: [],
};
