/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f0f1f3",
        overlay: "#3756828e",
        button: "#4379EE",
        gray: "#E4ECFF",
        customGray:"#e9e9e9",
        overlay: "#3756828e",
        border: "#D0D5DD",
      },
    },
  },

  plugins: [],
};
