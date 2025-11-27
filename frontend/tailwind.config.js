/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // blue undertone
        secondary: '#3B82F6', // complementary blue
        accent: '#60A5FA', // light blue accent
      },
    },
  },
  plugins: [
    require('@tailwindcss/postcss'),
  ],
}