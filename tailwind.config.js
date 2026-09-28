/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#1A1412',
          100: '#2C2420',
          200: '#5A4C46',
          400: '#C9BDB4',
          600: '#E8DFD6',
          800: '#F4EDE6',
          900: '#FFF8F2',
        },
        pine: {
          400: '#4ADDEA',
          500: '#2E8AE6',
          600: '#003DA5',
          700: '#002E86',
          800: '#001B94',
          900: '#001E5C',
        },
        ember: {
          400: '#FF8B6A',
          500: '#FF4B2B',
          600: '#E13216',
        },
        sand: {
          50: '#F4F8FC',
          100: '#E8F3FB',
          200: '#D7EAF8',
          300: '#B9D8F0',
        },
        paper: '#FFFFFF',
        copy: {
          DEFAULT: '#1B2430',
          muted: '#4E5D6E',
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -12px rgba(0, 30, 92, 0.18)',
        lift: '0 22px 40px -16px rgba(0, 30, 92, 0.22)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        dash: {
          to: { strokeDashoffset: '-24' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
        float: 'float 5s ease-in-out infinite',
        dash: 'dash 1.2s linear infinite',
      },
    },
  },
  plugins: [],
}
