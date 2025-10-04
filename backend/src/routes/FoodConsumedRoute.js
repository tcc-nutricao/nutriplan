import { api } from "../api/FoodConsumedApi.js"
import { genericRoute } from "./Route.js"
import { validate } from '../api/AuthApi.js'

export default (router) => {
  genericRoute(router, '/food-consumed', api)
}