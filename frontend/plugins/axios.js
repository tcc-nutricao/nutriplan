import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // tratamento de erros
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: axiosInstance,
    },
  }
})
