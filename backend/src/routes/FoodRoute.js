import { api } from '../api/FoodApi.js'
import { genericRoute } from './Route.js'
import { authenticate } from '../middleware/index.js'

export default (router) => {
  genericRoute(router, '/food', api, authenticate)
}
