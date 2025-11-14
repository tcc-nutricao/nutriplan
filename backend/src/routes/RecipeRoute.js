import { api } from "../api/RecipeApi.js"
import { genericRoute } from "./Route.js"

export default (router) => {
  genericRoute(router, '/recipe', api)
}