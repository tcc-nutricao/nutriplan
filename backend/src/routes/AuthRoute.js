import { login, logout, forgotPassword, resetPassword } from '../api/AuthApi.js'

const route = '/auth'

export default (router) => {
  router.post(`${route}/login`, login)
  router.post(`${route}/logout`, logout)
  router.post(`${route}/forgot-password`, forgotPassword)
  router.post(`${route}/reset-password`, resetPassword)
}
