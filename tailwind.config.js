/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'icono-portada': "url('/images/icono-expertis.png')",
        
      },
      fontFamily: {
        'montserrat': ['Montserrat'],
        'lato': ['Lato'],
        'garamond': ['Garamond'],
        'roboto': ['Roboto+Flex']
    }
    },
  },
  plugins: [],
}