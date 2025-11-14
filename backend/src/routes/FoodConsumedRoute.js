import { api } from "../api/FoodConsumedApi.js"
import { genericRoute } from "./Route.js"
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/food-consumed', api)
  router.get('/food-consumed/stats', authenticate, api.getFoodDiaryStatistics)
}