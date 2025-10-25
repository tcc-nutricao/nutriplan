import { FoodConsumedController } from '../controllers/FoodConsumedController.js'
import { generateCrudApi } from './Api.js'

const getFoodDiaryStatistics = async (req, res, next) => {
  try {
    await FoodConsumedController.getFoodDiaryStatistics(req, res, next)
  } catch (error) {
    next(error)
  }
}

export const api = {
  ...generateCrudApi(FoodConsumedController),
  getFoodDiaryStatistics
}