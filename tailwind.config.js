/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        brand: '#047857',
        'brand-light': '#ECFDF5',
        pink: '#E11D48',
        success: '#10B981',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 4px 14px rgba(4, 120, 87, 0.25)',
        card: '0 4px 20px rgba(15, 23, 42, 0.05)',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #047857, #10B981)',
      },
    }
  },
  plugins: [],
}
