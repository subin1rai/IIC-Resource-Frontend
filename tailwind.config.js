/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f0f1f3",
        overlay: "#3756828e",
      },
    },
  },
  plugins: [],
};
