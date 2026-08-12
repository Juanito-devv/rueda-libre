/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#DC2626',
          darkred: '#991B1B',
          charcoal: '#1E293B',
          slate: '#334155',
        }
      }
    },
  },
  plugins: [],
}