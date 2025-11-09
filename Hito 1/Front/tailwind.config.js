/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052CC',
          dark: '#003D99',
          light: '#0065FF',
        },
        success: {
          DEFAULT: '#00875A',
          dark: '#006644',
          light: '#00A86B',
        },
        error: {
          DEFAULT: '#DE350B',
          dark: '#BF2600',
          light: '#FF5630',
        },
        warning: {
          DEFAULT: '#FFAB00',
          dark: '#FF8B00',
          light: '#FFC400',
        },
      },
      fontFamily: {
        heading: ['Roboto', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
