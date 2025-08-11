// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  css: ['../assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiKey: '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  app: {
    baseURL: '/', // muda a raiz do app,
    head: {
      title: 'NutriPlan',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/np.svg' }
      ]
    }
  }  
})
