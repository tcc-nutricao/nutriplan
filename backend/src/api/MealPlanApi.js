import { MealPlanController } from '../controllers/MealPlanController.js'

export const insert = (req, res, next) => {
  MealPlanController.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  MealPlanController.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  MealPlanController.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  MealPlanController.remove(req, res, next).catch(next)
}
