/** @type {import('tailwindcss').Config} */
module.exports = {
  important: `#${process.env.APP_NAME}`,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['variant', '&:not(.light *)'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
