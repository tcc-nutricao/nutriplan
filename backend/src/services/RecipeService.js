import { RecipeRepository } from '../repositories/RecipeRepository.js'
import { MealPlanRecipeRepository } from '../repositories/MealPlanRecipeRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  async create(data) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const { recipeFoods, recipePreferences, ...recipeData } = data

        let calculatedCalories = 0;
        
        if (recipeFoods && recipeFoods.length > 0) {
          for (const rf of recipeFoods) {
            const food = await tx.food.findUnique({
              where: { id: rf.id_food },
              include: { portions: true }
            });
            
            if (food) {
              let grams = 0;
              const unitId = rf.id_unit_of_measurement;
              const qty = rf.quantity;
              
              const unit = await tx.unitOfMeasurement.findUnique({ where: { id: unitId } });
              const unitName = unit?.name?.toLowerCase() || '';
              
              if (['g', 'grama', 'gramas', 'ml', 'mililitro', 'mililitros'].includes(unitName)) {
                grams = qty;
              } else if (['kg', 'quilograma', 'l', 'litro'].includes(unitName)) {
                grams = qty * 1000;
              } else {
                const portion = food.portions.find(p => p.id_unit_of_measurement === unitId);
                if (portion) {
                  grams = portion.gram_weight * qty;
                } else {
                  if (unitName.includes('colher de sopa')) grams = 15 * qty;
                  else if (unitName.includes('colher de chá')) grams = 5 * qty;
                  else if (unitName.includes('xícara')) grams = 240 * qty;
                  else if (unitName.includes('unidade')) grams = 100 * qty; 
                }
              }
              
              const foodCalories = (food.calories / 100) * grams;
              calculatedCalories += foodCalories;
            }
          }
        }

        const recipe = await tx.recipe.create({
          data: {
            ...recipeData,
            calories: Math.round(calculatedCalories), 
            created_at: new Date(),
            updated_at: new Date(),
          },
        })

        if (recipeFoods && recipeFoods.length > 0) {
          await tx.recipeFood.createMany({
            data: recipeFoods.map(rf => ({
              id_recipe: recipe.id,
              id_food: rf.id_food,
              id_unit_of_measurement: rf.id_unit_of_measurement,
              quantity: rf.quantity,
              id_preparation_method: rf.id_preparation_method || null,
              created_at: new Date(),
              updated_at: new Date(),
            })),
          })
        }

        if (recipePreferences && recipePreferences.length > 0) {
          await tx.recipePreference.createMany({
            data: recipePreferences.map(rp => ({
              id_recipe: recipe.id,
              id_preference: rp.id_preference,
              created_at: new Date(),
              updated_at: new Date(),
            })),
          })
        }

        const completeRecipe = await tx.recipe.findUnique({
          where: { id: recipe.id },
          include: {
            recipeFoods: {
              include: {
                food: true,
                unit_of_measurement: true,
                preparationMethod: true,
              },
            },
            recipePreferences: {
              include: {
                preference: {
                  select: {
                    id: true,
                    name: true,
                    icon: true,
                  },
                },
              },
            },
          },
        })

        return completeRecipe
      })

      return calculateRecipeNutrition(result)
    } catch (error) {
      console.error('Erro ao criar receita:', error)
      throw error
    }
  },

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
  },

  async toggleFavorite(userId, recipeId) {
    try {
      const isFav = await RecipeRepository.isFavorite(userId, recipeId)
      if (isFav) {
        await RecipeRepository.removeFavorite(userId, recipeId)
        return { favorited: false }
      } else {
        await RecipeRepository.addFavorite(userId, recipeId)
        return { favorited: true }
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error)
      throw error
    }
  },

  async getFavorites(userId) {
    try {
      const favorites = await RecipeRepository.findFavoritesByUserId(userId)
      return favorites.map(fav => {
        const recipe = fav.recipe
        return calculateRecipeNutrition(recipe)
      })
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      throw error
    }
  }
}
