/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryViolet: '#976CAE',
        primaryOrange: '#F4783B',
        black: '#112042',
        fontColor: '#575757',
        borderColor: '#EDEDED',
        inputBg: '#F5F6FA',
      },
    },
  },
  plugins: [],
}
