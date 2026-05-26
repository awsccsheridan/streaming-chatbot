import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        aws: {
          navy: "#232F3E",
          orange: "#FF9900",
          dark: "#111827"
        }
      }
    },
  },
  plugins: [],
};

export default config;
