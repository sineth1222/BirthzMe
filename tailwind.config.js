/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dreamy Pink template tokens.
        dreamy: {
          cream: "#FDF3EF",
          blush: "#F6DDE0",
          rose: "#B8265A",
          "rose-deep": "#7C1638",
          gold: "#E3B583",
          mauve: "#7A5766",
        },
        wine: {
          DEFAULT: "#6B1E3C",
          dark: "#3F1024",
          light: "#8C3357",
        },
        rosegold: "#D9A6A0",
        vanilla: "#FFF3E4",
        blush: "#F7D9E3",
        neon: "#FF5C8A",
        ink: "#2B1620",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
        script: ["Caveat", "cursive"],
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
        scriptnew: ['"Great Vibes"', "cursive"],
        bodynew: ["Inter", "sans-serif"],
        elegant: ['"Alex Brush"', "cursive"],
      },
    },
  },
  plugins: [],
};
