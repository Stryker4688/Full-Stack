// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'cursive': ['"Pacifico"', 'cursive'],
        'cursive2': ['"Sriracha"', 'cursive'],
        'merienda': ['"Merienda"', 'cursive'],
      },
      animation: {
        'steam': 'steam 3s infinite ease-out',
      },
      keyframes: {
        steam: {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '0.2'
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.1)',
            opacity: '0.1'
          },
          '100%': {
            transform: 'translateY(-40px) scale(1.2)',
            opacity: '0'
          }
        }
      },
      backgroundImage: {
        'coffee-texture': "url('./assets/coffee-texture.jpg.jpeg')",
        'coffee-beans': "url('./assets/coffee-beans-bg.jpg.jpeg')",
        'coffee-pattern': "url('./assets/coffee-pattern.jpg.jpeg')",
        'coffee-background': "url('./assets/coffee-background-new.jpg.avif')",
      },
      colors: {
        dark: {
          primary: '#1f2937',
          secondary: '#374151',
          text: '#f9fafb'
        }
      }
    },
  },
  plugins: [],
}