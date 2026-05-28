/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          amber: '#F5A623',
          amberLight: '#FFF3D4',
          dark: '#1A1A2E',
          darkBg: '#0B0A09',
          darkCard: '#131211',
          darkBorder: '#22201E',
          warmWhite: '#F7F5F0',
        },
        surface: {
          bg: '#0B0A09',
          card: '#131211',
          sidebar: '#0E0D0C',
          border: '#22201E',
        },
        text: {
          primary: '#F7F5F0',
          secondary: '#A3A29E',
          muted: '#73726E',
        },
        accent: {
          blue: '#3B82F6',
          red: '#EF4444',
        },
      },
    },
  },
  plugins: [],
}

