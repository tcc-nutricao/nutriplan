import { GeminiController } from '../controllers/GeminiController.js'
import { authenticate } from '../api/AuthApi.js'

export default (router) => {
  router.post('/gemini/recipes/:patientId', authenticate, GeminiController.generateRecipeRecommendations)
  router.post('/gemini/analyze-food/:foodName', authenticate, GeminiController.analyzeFood)
  router.post('/gemini/meal-plan/:patientId', authenticate, GeminiController.generateMealPlan)
  router.post('/gemini/chat', authenticate, GeminiController.nutritionChat)
}