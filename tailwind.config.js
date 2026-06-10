/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        brand: '#7C5CFC',
        pink: '#FC5C7D',
        success: '#00D4AA',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(124,92,252,0.35)',
        card: '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #7C5CFC, #FC5C7D)',
      },
    }
  },
  plugins: [],
}
