import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070c17",
          900: "#0b1220",
          850: "#0f1830",
          800: "#141f3d",
          700: "#1b2a4d",
          600: "#26375f",
        },
        gold: {
          400: "#e3c26f",
          DEFAULT: "#D4A947",
          600: "#b78a2e",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
