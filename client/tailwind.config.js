/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1c',
        surface: '#151b2b',
        primary: '#3b82f6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      }
    },
  },
  plugins: [],
}
