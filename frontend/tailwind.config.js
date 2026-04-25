/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#FEE2E2',
        },
        secondary: {
          DEFAULT: '#4C1D95',
          hover: '#2E1065',
          light: '#EDE9FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
