import { api } from "../api/MealApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/meal', api)
}