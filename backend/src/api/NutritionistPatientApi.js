import { NutritionistPatient } from '../controllers/NutritionistPatient.js'

export const insert = (req, res, next) => {
  NutritionistPatient.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  NutritionistPatient.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  NutritionistPatient.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  NutritionistPatient.remove(req, res, next).catch(next)
}
