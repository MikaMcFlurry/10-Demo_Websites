/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        ink: '#141312',
        subtle: '#6E6760',
        hairline: '#E7DED3',
        accent: '#C45D3D',
        'accent-2': '#2E4AD9',
        highlight: '#D9B65E',
      },
      fontFamily: {
        serif: ['ui-serif', 'Georgia', '"Times New Roman"', 'Times', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      typography: {},
    },
  },
  plugins: [],
};
