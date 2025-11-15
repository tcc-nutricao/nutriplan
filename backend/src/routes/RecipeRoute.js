import { api } from "../api/RecipeApi.js"
import { genericRoute } from "./Route.js"
import { authenticate, authorize } from '../middleware/index.js'
import { Roles } from "../config/roles.js";

export default (router) => {
  genericRoute(router, '/recipe', api, authenticate)
  router.get('/get-patient-recipes', authenticate, api.getPatientRecipes, authorize(Roles.STANDARD))
}