import { FoodConsumedRepository } from '../repositories/FoodConsumedRepository.js'
import { generateCrudService } from './Service.js'
import { MealPlanService } from './MealPlanService.js'
import { PatientService } from './PatientService.js'
import { RecipeService } from './RecipeService.js'

const calculateNutritionalStatistics = async (foodConsumedList) => {
  const statistics = {
    totalCalories: 0,
    totalProteins: 0,
    totalCarbohydrates: 0,
    totalFats: 0,
    totalAddedSugars: 0,
    totalFiber: 0,
    totalWater: 0
  }

  // Calcular ingestão total de água uma vez para todo o período -> cria lógica
//   const totalWater = await HydrationService.getTotalWaterIntakeForDate(dateRange, patientId)
  statistics.totalWater = 0

  for (const item of foodConsumedList) {
    const quantity = item.quantity || 0
    const food = item.food || {}
    const recipe = item.recipe || {}
    
    if (recipe && Object.keys(recipe).length > 0) {
      try {
        const fullRecipe = await RecipeService.findById(recipe.id)
        if (fullRecipe) {
          statistics.totalCalories += (fullRecipe.totalCalories || 0) * quantity
          statistics.totalProteins += (fullRecipe.totalProteins || 0) * quantity
          statistics.totalCarbohydrates += (fullRecipe.totalCarbohydrates || 0) * quantity
          statistics.totalFats += (fullRecipe.totalFats || 0) * quantity
          statistics.totalAddedSugars += (fullRecipe.totalSugar || 0) * quantity
          statistics.totalFiber += (fullRecipe.totalFiber || 0) * quantity
        }
      } catch (error) {
        console.error(`Erro ao buscar receita ${recipe.id}:`, error)
      }
    } else if (food && Object.keys(food).length > 0) {
      statistics.totalCalories += (food.calories || 0) * quantity
      statistics.totalProteins += (food.protein || 0) * quantity
      statistics.totalCarbohydrates += (food.carbs || 0) * quantity
      statistics.totalFats += (food.fat || 0) * quantity
      statistics.totalAddedSugars += (food.sugar || 0) * quantity
      statistics.totalFiber += (food.fiber || 0) * quantity
    }

  }
  return statistics
}

const baseCrudService = generateCrudService(FoodConsumedRepository)

export const FoodConsumedService = {
  ...baseCrudService,

  async getFoodDiaryStatistics(dates, userId) {
    try {
        let dateRange
        
        if (!dates || !Array.isArray(dates) || dates.length === 0) {
          throw new AppError({ message: 'Array de datas é obrigatório e deve conter pelo menos 1 elemento', field: 'dates' })
        }
        
        if (dates.length === 1) {
          const targetDate = new Date(dates[0])
          const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
          const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
          dateRange = [startOfDay, endOfDay]
        } else if (dates.length === 2) {
          const startDate = new Date(dates[0])
          const endDate = new Date(dates[1])
          
          if (startDate > endDate) {
            dateRange = [endDate, startDate]
          } else {
            dateRange = [startDate, endDate]
          }
        } else {
          throw new AppError({ message: 'Array de datas deve conter 1 ou 2 elementos', field: 'dates' })
        }

        const patient = await PatientService.getPatientByUserId(userId)

        const activeMealPlan = await MealPlanService.getActiveMealPlanForPatient(patient.id)

        if (!activeMealPlan) {
          throw new AppError({ message: 'Nenhum plano de refeição ativo encontrado.' })
        }

        const mealPlanMeals = activeMealPlan.mealPlanMeals || []

        if (mealPlanMeals.length === 0) {
          return { data: [], total: 0, message: 'Nenhuma refeição encontrada no plano ativo.' }
        }

        let allFoodConsumed = []
        const mealPlanMealsWithFilteredFood = mealPlanMeals.map(mealPlanMeal => {
          const foodConsumed = mealPlanMeal.foodConsumed || []
          
          const foodConsumedInPeriod = foodConsumed.filter(item => {
            const itemDate = new Date(item.date)
            return itemDate >= dateRange[0] && itemDate <= dateRange[1]
          })
          
          allFoodConsumed = allFoodConsumed.concat(foodConsumedInPeriod)
          
          return {
            ...mealPlanMeal,
            filteredFoodConsumed: foodConsumedInPeriod
          }
        })

        if (allFoodConsumed.length === 0) {
            return { data: [], total: 0, message: 'Nenhum alimento consumido encontrado para o período especificado.' }
        }

        const statistics = await calculateNutritionalStatistics(allFoodConsumed)

        const mealsWithFood = await Promise.all(mealPlanMealsWithFilteredFood.map(async (mealPlanMeal) => {
          const foodsConsumedInMeal = mealPlanMeal.filteredFoodConsumed

          const consumedItems = await Promise.all(foodsConsumedInMeal.map(async (item) => {
            const element = item.food || item.recipe
            let itemDetails = { id: element.id, name: element.name }
            let unitOfMeasurement = { 
                id: item.unitOfMeasurement.id, 
                name: item.unitOfMeasurement.name, 
                symbol: item.unitOfMeasurement.symbol 
            }

            return {
              id: item.id,
              quantity: item.quantity,
              date: item.date,
              unitOfMeasurement,
              item: itemDetails
            }
          }))

          return {
            id: mealPlanMeal.id,
            name: mealPlanMeal.name,
            consumedItems
          }
        }))

        const data = {
            totalMacros: statistics,
            meals: mealsWithFood
        }

        return { data }
  
    } catch (err) {
      console.error('Erro em getFoodDiaryStatistics:', err)
      throw err
    }
  }
}

