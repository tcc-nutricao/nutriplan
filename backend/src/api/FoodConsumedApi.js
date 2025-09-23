import { FoodConsumedController } from '../controllers/FoodConsumedController.js'

export const insert = (req, res, next) => {
  FoodConsumedController.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  FoodConsumedController.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  FoodConsumedController.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  FoodConsumedController.remove(req, res, next).catch(next)
}
