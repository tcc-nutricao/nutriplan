/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        'np': '#8a5acd',
        'p': {
          50: '#f6f5fd',
          100: '#f0edfa',
          200: '#e3ddf7',
          300: '#cec2f0',
          400: '#b49fe6',
          500: '#9b78da',
          600: '#8a5acd',
          700: '#7a48b9',
          800: '#663c9b',
          900: '#553280',
          950: '#351f56',
          g: '#F6F5FD',
          g2: '#B9B6C9',
          npShadow: 'rgba(128, 0, 255, 0.5)'
        },
        't': '#351f56',
        'danger': '#EA3939',
        'danger-light': '#FF5858',
        'success': '#2FC44F',
        'gray-medium': '#b4a9c5',
        'gray-dark': '#877d92',
        'ic':{
          'gluten': '#ffb900',
          'antinfl': '#00d3f2',
          'antiox': '#ffd230',
          'colesterol': '#ea3939',
          'emagrecer': '#f54900',
          'energia': '#ffdf20',
          'intestino': '#c800de',
          'lactose': '#2b7fff',
          'manterpeso': '#ad46ff',
          'musculo': '#ffb86a',
          'nozes': '#a65f00',
          'peixe': '#00bba7',
          'sono': '#432dd7',
          'sugar': '#f6339a',
          'vegano': '#7ccf00',
          'vegetariano': '#00a63e',
        }
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 15px 40px rgba(0, 0, 0, 0.2)',
        'btn-hover': '0 4px 8px rgba(53, 31, 86, 1)', // R950 com 0.2 alpha
        'np': '0 4px 8px rgba(128, 0, 255, 0.5)',
        'progress': '0 0px 25px rgba(128, 0, 255, 0.3)',
      },
      dropShadow: {
        'np2': '0 10px 10px rgba(128, 0, 255, 0.1)',
        'np': '0 10px 10px rgba(138, 90, 205, 0.2)',
        'nplight': '0 10px 10px rgba(138, 90, 205, 0.2)',
      }
    },
  },  
  plugins: [],
}
