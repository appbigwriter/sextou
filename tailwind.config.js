/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F8FAFC',
        foreground: '#0F172A',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
        accent: '#FCD34D',
        secondary: '#3B82F6',
      },
    },
  },
  plugins: [],
}
