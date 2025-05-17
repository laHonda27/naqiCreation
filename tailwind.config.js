/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf7f2',
          100: '#f3ece0',
          200: '#e7dbca',
          300: '#d8c4ad',
          400: '#c9ac90',
          500: '#ba9478',
          600: '#a47a60',
          700: '#8d6551',
          800: '#775446',
          900: '#64463c',
        },
        taupe: {
          50: '#f5f5f4',
          100: '#e6e4e2',
          200: '#cdc9c5',
          300: '#b3aca5',
          400: '#9a918a',
          500: '#857b73',
          600: '#6f655e',
          700: '#5c544d',
          800: '#4d4641',
          900: '#413c38',
        },
        rose: {
          50: '#fef2f4',
          100: '#fde6ea',
          200: '#fbd0d9',
          300: '#f7aab9',
          400: '#f27a94',
          500: '#e5526f',
          600: '#d22f52',
          700: '#b62042',
          800: '#981d3b',
          900: '#801c35',
        },
        cream: {
          50: '#fffcf7',
          100: '#fbf6ed',
          200: '#f5e8d4',
          300: '#edd6b4',
          400: '#e3bc8a',
          500: '#d8a166',
          600: '#c98047',
          700: '#b96438',
          800: '#964f30',
          900: '#7b422b',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.08)',
        showcase: '0 15px 35px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/bg-texture.png')",
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};