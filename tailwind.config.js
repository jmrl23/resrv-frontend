const twColors = require('tailwindcss/colors')

// depracated colors
delete twColors['lightBlue']
delete twColors['warmGray']
delete twColors['trueGray']
delete twColors['coolGray']
delete twColors['blueGray']


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/{pages,views,components}/**/*.tsx'
  ],
  theme: {
    colors: twColors,
    extend: {
      fontFamily: {
        poppins: ['\'Poppins\'', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
