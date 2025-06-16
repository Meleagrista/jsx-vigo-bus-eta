/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.html",
    "./src/**/*.{js,ts,jsx,tsx}"  // all your React components
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: {
          DEFAULT: '#4e75af',
        },
        brandRed: {
          DEFAULT: '#f8443c',
        },
        gray: {
          light: '#d1d5db',
          DEFAULT: '#6b7280',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
};

