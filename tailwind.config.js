/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#00F5D4',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 