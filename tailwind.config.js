module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#29ccc4',
        primaryDark: '#2fbab3',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  variants: {
    borderWidth: ['first', 'last'],
  },
  plugins: [],
  corePlugins: {
    container: false,
  }
}
