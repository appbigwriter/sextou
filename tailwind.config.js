/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B3C6F',
        secondary: '#1E5AA8',
        gold: '#FFC300',
        darkGold: '#E6A800',
      },
    },
  },
  plugins: [],
}
