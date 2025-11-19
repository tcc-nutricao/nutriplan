export default {
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  css: [
    '../assets/css/tailwind.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiKey: '',
    // internalApiBase: process.env.NUXT_INTERNAL_API_BASE,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  app: {
    baseURL: '/',
    head: {
      title: 'NutriPlan',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/np.svg' }],
    },
  },
  devServer: {
    host: 'localhost',
    port: 3000,      
    watch: {
      usePolling: true,
    }
  }
};
