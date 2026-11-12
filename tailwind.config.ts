import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#111111",
        surface: {
          DEFAULT: "#181818",
          border: "#242424",
          borderHover: "#333333",
        },
        accent: {
          DEFAULT: "#8b5cf6", // ONE muted violet accent
          hover: "#7c3aed",
          light: "#a78bfa",
        },
        content: {
          DEFAULT: "#f3f3f3",
          muted: "#888888",
          subtle: "#555555",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
