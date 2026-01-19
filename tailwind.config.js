/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#111418",
        "surface-dark": "#283039",
        "surface-light": "#ffffff",
        "text-secondary": "#9dabb9",
        "success": "#0bda5b",
        "danger": "#ef4444",
        "accent": "#5b8ff9",
        "purple": "#9b59b6",
        "orange": "#f39c12",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
