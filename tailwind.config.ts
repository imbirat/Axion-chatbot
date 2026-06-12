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
        base: {
          bg: "#1F1F1E",
          surface: "#2A2A29",
          border: "#3A3A39",
          hover: "#303030",
        },
        text: {
          primary: "#F0EFED",
          secondary: "#9B9B99",
          muted: "#6B6B69",
        },
        accent: {
          DEFAULT: "#7C6FEC",
          hover: "#6B5FDC",
          subtle: "#2D2844",
        },
        success: "#4CAF82",
        warning: "#E5A44A",
        danger: "#E5554A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        chat: "18px",
        input: "14px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
