import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const isServer = process.server

  const axiosInstance = axios.create({
    baseURL: isServer ? config.internalApiBase : config.public.apiBase,
    withCredentials: true
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && process.client) {
        window.location.href = '/'
      }
      return Promise.reject(error)
    }
  )

  nuxtApp.provide('axios', axiosInstance)
})
