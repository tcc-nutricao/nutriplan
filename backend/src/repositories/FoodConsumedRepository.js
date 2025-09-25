import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Métodos customizados
const create = async (data, tx = null) => {
  const client = tx || prisma
  return await client.foodConsumed.create({
    data: {
      id_meal_plan_meal: data.mealPlanMealId,
      id_food: data.foodId,
      id_recipe: data.recipeId || null,
      id_unit_of_measurement: data.unitOfMeasurementId,
      quantity: data.quantity,
      date: data.date ? new Date(data.date) : new Date(),
      created_at: new Date()
    }
  })
}

const update = async (id, data) => {
  return await prisma.foodConsumed.update({
    where: { id },
    data: {
      id_meal_plan_meal: data.mealPlanMealId,
      id_food: data.foodId,
      id_recipe: data.recipeId || null,
      id_unit_of_measurement: data.unitOfMeasurementId,
      quantity: data.quantity,
      date: data.date ? new Date(data.date) : undefined,
      updated_at: new Date()
    }
  })
}

export const FoodConsumedRepository = {
  ...generateCrudRepository('foodConsumed', {
    softDelete: false,
    defaultOrderBy: 'id',
    defaultIncludes: {
      mealPlanMeal: true,
      food: true,
      recipe: true,
      unitOfMeasurement: true
    }
  }),
  create, // Sobrescreve o create padrão
  update  // Sobrescreve o update padrão
}
