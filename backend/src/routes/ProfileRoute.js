import { api } from "../api/ProfileApi.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  router.get('/profile', authenticate, api.getProfileByRole);
}