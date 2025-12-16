/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#F8FAFC",
        muted: "#475569",
        primary: "#6D28D9",
      },
    },
  },

  plugins: [],
};
