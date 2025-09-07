/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff8f0',
          100: '#ffedd1',
          200: '#ffd9a3',
          300: '#ffc074',
          400: '#ffa545',
          500: '#ff8c00', // Main logo orange from your image
          600: '#e67300',
          700: '#cc5a00',
          800: '#b34100',
          900: '#992800',
          950: '#661a00',
        },
        primary: {
          50: '#fff8f0',
          100: '#ffedd1',
          200: '#ffd9a3',
          300: '#ffc074',
          400: '#ffa545',
          500: '#ff8c00', // Main logo orange from your image
          600: '#e67300',
          700: '#cc5a00',
          800: '#b34100',
          900: '#992800',
          950: '#661a00',
        }
      }
    },
  },
  plugins: [],
};