import { RecipeController } from '../controllers/RecipeController.js'

export const insert = (req, res, next) => {
  RecipeController.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  RecipeController.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  RecipeController.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  RecipeController.remove(req, res, next).catch(next)
}
