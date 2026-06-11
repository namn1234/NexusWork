import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: "#080c14",
        surface: "#0d1321",
        accent: "#4f8ef7",
        accent2: "#a78bfa",
        accent3: "#34d399",
        muted: "#6b7a99",
        "text-primary": "#e8edf5",
        "glass-border": "rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
