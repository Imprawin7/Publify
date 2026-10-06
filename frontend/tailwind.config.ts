import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161A20",
        paper: "#F7F4EC",
        slate: "#5B6270",
        accent: "#1F6F63",
        line: "#DAD5C6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-plex)", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
        page: "68rem",
      },
    },
  },
  plugins: [],
};

export default config;
