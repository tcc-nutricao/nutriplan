import { RecipeRepository } from '../repositories/RecipeRepository.js'
import { generateCrudService } from './Service.js'

// Função para calcular valores nutricionais da receita baseado nos alimentos
const calculateRecipeNutrition = (recipe) => {
  if (!recipe.recipeFoods || recipe.recipeFoods.length === 0) {
    return {
      ...recipe,
      totalCalories: 0,
      totalProteins: 0,
      totalCarbohydrates: 0,
      totalFats: 0,
      totalSugar: 0,
      totalFiber: 0
    }
  }

  let totalCalories = 0
  let totalProteins = 0
  let totalCarbohydrates = 0
  let totalFats = 0
  let totalSugar = 0
  let totalFiber = 0

  // Calcular com base nos alimentos que compõem a receita
  recipe.recipeFoods.forEach(recipeFood => {
    const food = recipeFood.food
    const nutritionValue = recipeFood.quantity
    
    if (food) {
      totalCalories += (food.calories || 0) * nutritionValue
      totalProteins += (food.protein || 0) * nutritionValue
      totalCarbohydrates += (food.carbs || 0) * nutritionValue
      totalFats += (food.fat || 0) * nutritionValue
      totalSugar += (food.sugar || 0) * nutritionValue
      totalFiber += (food.fiber || 0) * nutritionValue
    }
  })

  return {
    ...recipe,
    totalCalories: totalCalories,
    totalProteins: totalProteins,
    totalCarbohydrates: totalCarbohydrates,
    totalFats: totalFats,
    totalSugar: totalSugar,
    totalFiber: totalFiber,
  }
}

const baseCrudService = generateCrudService(RecipeRepository)

export const RecipeService = {
  ...baseCrudService,

  // Sobrescrever o método findById para incluir cálculos nutricionais
  async findById(id) {
    try {
      const recipe = await RecipeRepository.findById(id)
      
      if (!recipe) {
        return null
      }

      return calculateRecipeNutrition(recipe)
    } catch (error) {
      console.error('Erro ao buscar receita com cálculos nutricionais:', error)
      throw error
    }
  },

  // Sobrescrever o método search para incluir cálculos nutricionais
  async search(params = {}) {
    try {
      const result = await RecipeRepository.search(params)
      
      if (result && result.data) {
        result.data = result.data.map(recipe => calculateRecipeNutrition(recipe))
      }

      return result
    } catch (error) {
      console.error('Erro ao buscar receitas com cálculos nutricionais:', error)
      throw error
    }
  },
}


