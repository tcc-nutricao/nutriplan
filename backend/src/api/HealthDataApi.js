import { HealthDataController } from '../controllers/HealthDataController.js'

export const insert = (req, res, next) => {
  HealthDataController.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  HealthDataController.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  HealthDataController.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  HealthDataController.remove(req, res, next).catch(next)
}
