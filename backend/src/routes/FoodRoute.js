import { api } from '../api/FoodApi.js'
import { genericRoute } from './Route.js'

export default (router) => {
  genericRoute(router, '/food', api)
}
