/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        loading: 'loading 2s linear infinite',
        fadeIn: 'fadeIn 1s ease-in forwards',
      },
      keyframes: {
        loading: {
          '0%': { left: '-2.6vw' },
          '100%': { left: '20vw' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
