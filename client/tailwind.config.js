/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', "./index.html"],
  theme: {
    fontFamily: {
      'body': ["source-sans"],
    },
    extend: {
      fontFamily: {
        "source-sans": ["source-sans", "sans-serif"],
      },
      colors: {
        "mv-color": "#0099FA",
      },
    },
  },
  plugins: [],
}

