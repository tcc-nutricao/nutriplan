import axios from 'axios'
// import store from '@/store'
const frontendUrl = import.meta.env.NUXT_PUBLIC_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: frontendUrl,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || 'Ocorreu um erro'

      // if (status === 401 || status === 419) {
      //   store.dispatch('setError', { message })

      //   // Redirecionar para o login se necessário
      //   // window.location.href = `${deployPath}/login`
      // } else if (status === 403) {
      //   store.dispatch('setError', { message })
      // }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
