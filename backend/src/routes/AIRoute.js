import { AIController } from '../controllers/AIController.js'
import { validate } from '../api/AuthApi.js'

export default (router) => {
  // Gerar recomendações de receitas para um paciente
  router.post('/ai/recipes/:patientId', validate, AIController.generateRecipeRecommendations)
  
  // Analisar compatibilidade de alimento
  router.post('/ai/analyze-food/:foodName', validate, AIController.analyzeFood)
  
  // Gerar plano de refeições personalizado
  router.post('/ai/meal-plan/:patientId', validate, AIController.generateMealPlan)
  
  // Chat livre com IA nutricional
  router.post('/ai/chat', validate, AIController.nutritionChat)
}