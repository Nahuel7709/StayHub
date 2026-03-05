module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#31401F",
        background: "#FAFAFA",
        card: "#EFE4D3",
        secondary: "#51624A",
        accent: "#9A4A2F",
        border: "#E7DCCB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
