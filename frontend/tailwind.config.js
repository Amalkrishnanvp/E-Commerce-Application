/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.hbs"],
  theme: {
    extend: {
      colors: {
        "custom-color-1": "#1b263b",
        "custom-color-2": "#2f3848",
        "custom-color-3": "#012a4a",
        "custom-color-4": "#013a63",
        primaryColor: "#14213d",
        secondaryColor: "#4a4e69",
        accentColor: "#9a8c98",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
