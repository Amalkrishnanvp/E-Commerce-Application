/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.hbs"],
  theme: {
    extend: {
      colors: {
        "custom-color-1": "#1b263b",
        "custom-color-2": "#2f3848",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
