import { GeminiController } from '../controllers/GeminiController.js'
import { validate } from '../api/AuthApi.js'

export default (router) => {
  // Rotas usando Google Gemini (gratuito)
  
  // Gerar recomendações de receitas para um paciente
  router.post('/gemini/recipes/:patientId', validate, GeminiController.generateRecipeRecommendations)
  
  // Analisar compatibilidade de alimento
  router.post('/gemini/analyze-food/:foodName', validate, GeminiController.analyzeFood)
  
  // Gerar plano de refeições personalizado
  router.post('/gemini/meal-plan/:patientId', validate, GeminiController.generateMealPlan)
  
  // Chat livre com IA nutricional
  router.post('/gemini/chat', validate, GeminiController.nutritionChat)
}