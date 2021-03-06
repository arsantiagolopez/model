const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1f1f1f",
        secondary: "#252525",
        tertiary: "#292929",
        fourth: colors.gray[400],
      },
      fontFamily: {
        Signika: ["Signika Negative", "sans-serif"],
      },
      display: ["group-hover"],
      animation: {
        "spin-slow": "spin 5s linear infinite",
      },
    },
  },
};
