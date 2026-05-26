import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px -24px rgb(15 23 42 / 0.35)",
      },
      colors: {
        ink: "#0f172a",
      },
    },
  },
  plugins: [],
};

export default config;
