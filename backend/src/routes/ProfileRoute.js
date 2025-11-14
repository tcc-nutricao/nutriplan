import { api } from "../api/ProfileApi.js"
import { authenticate } from '../api/AuthApi.js'

export default (router) => {
  router.get('/profile', authenticate, api.getProfileByRole);
}