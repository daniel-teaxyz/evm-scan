import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "font-bold",
  ],
  theme: {
    fontSize: {
      xs: ["0.75rem", "1.125rem"],
      sm: ["0.875rem", "1.3125rem"],
      base: ["1rem", "1.5rem"],
      lg: ["1.125rem", "1.6875rem"],
      xl: ["1.25rem", "1.875rem"],
      "2xl": ["1.5rem", "2.25rem"],
      "3xl": ["1.875rem", "2.8125rem"],
      "4xl": ["2.25rem", "3.375rem"],
      "5xl": ["3rem", "3.9rem"],
      "6xl": ["3.75rem", "5.625rem"],
      "7xl": ["4.5rem", "6.75rem"],
      "8xl": ["6rem", "9rem"],
      "9xl": ["8rem", "12rem"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
