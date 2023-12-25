const { tailwindConfig } = require('@storefront-ui/react/tailwind-config');
const sfTypography = require('@storefront-ui/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tailwindConfig],
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@storefront-ui/react/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#257DE4',
          50: '#C8DEF8',
          100: '#B6D4F6',
          200: '#92BEF1',
          300: '#6EA8ED',
          400: '#4993E8',
          500: '#257DE4',
          600: '#1762BA',
          700: '#114888',
          800: '#0B2D56',
          900: '#041324',
          950: '#01060B',
        },
      },
      gridTemplateAreas: {
        'product-page': ['left-top right', 'left-bottom right'],
      },
      gridTemplateColumns: {
        'product-page': 'minmax(56%, 500px) auto',
      },
      gridTemplateRows: {
        'category-sidebar': 'min-content auto min-content',
      },
      screens: {
        '4xl': '1920px',
        '3xl': '1536px',
        '2xl': '1366px',
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '640px',
        xs: '376px',
        '2xs': '360px',
      },
      fontFamily: {
        body: 'var(--font-body)',
        headings: 'var(--font-headings)',
      },
    },
  },
  plugins: [sfTypography, require('@savvywombat/tailwindcss-grid-areas')],
};
