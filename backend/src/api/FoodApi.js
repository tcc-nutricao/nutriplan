import { FoodController } from '../controllers/FoodController.js'

export const insert = (req, res, next) => {
  FoodController.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  FoodController.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  FoodController.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  FoodController.remove(req, res, next).catch(next)
}
