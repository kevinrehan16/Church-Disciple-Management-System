/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          blue: '#0284c7',   // Primary
          green: '#16a34a',  // Success
          pink: '#db2777',   // Care/Alert
          dark: '#1e293b',   // Text
          light: '#f8fafc',  // Background
        }
      }
    },
  },
  plugins: [],
}