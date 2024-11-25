/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#E88D72',
          light: '#FFE4DC',
        },
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(232,141,114,0.12), 0 0 15px -3px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};