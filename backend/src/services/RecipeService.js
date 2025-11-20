import { RecipeRepository } from '../repositories/RecipeRepository.js'
import { MealPlanRecipeRepository } from '../repositories/MealPlanRecipeRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  async getPatientRecipes(userId) {
    try {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }
      const patient = await PatientRepository.findByUserId(userId)
      if (!patient) {
        throw new Error('Paciente não encontrado para o ID do usuário fornecido')
      }
      return await MealPlanRecipeRepository.findByPatientId(patient.id)
    } catch (error) {
      console.error('Erro ao buscar receitas do usuário:', error)
      throw error
    }
  },

  async searchByTerm(searchTerm, limit = 10) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return { data: [], total: 0 }
      }

      const where = {
        deleted_at: null,
        name: {
          contains: searchTerm.trim()
        }
      }

      const [data, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          take: limit,
          select: {
            id: true,
            name: true,
            preparation_method: true
          },
          orderBy: { name: 'asc' }
        }),
        prisma.recipe.count({ where })
      ])

      return { data, total }
    } catch (error) {
      console.error('Erro ao pesquisar receitas:', error)
      throw error
    }
  }
}


