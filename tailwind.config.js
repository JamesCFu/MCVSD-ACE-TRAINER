/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}", // Scans all JS/TS files in root and subfolders
    "!./node_modules/**"       // Ignores node_modules to prevent errors
  ],
  theme: {
    extend: {
      // Defines custom animations used in your components
      animation: {
        'shake': 'shake 0.2s ease-in-out 0s 2',
        'speed-lines': 'speed-lines 0.5s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'speed-lines': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
