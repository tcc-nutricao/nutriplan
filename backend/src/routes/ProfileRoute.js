import { api } from "../api/ProfileApi.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  router.get('/profile', validate, api.getProfileByRole);
}