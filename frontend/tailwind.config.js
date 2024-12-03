// tailwind.config.js
const colors = require('tailwindcss/colors');                 // TODO: Verify if needed

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A192F',  // Dark blue
          light: '#112240',
          dark: '#020C1B'
        },
        accent: {
          DEFAULT: '#FCD34D',  // Yellow
          light: '#FBBF24',
          dark: '#F59E0B'
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: [require('flowbite/plugin')]
};