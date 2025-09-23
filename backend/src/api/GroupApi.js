import { GroupController } from '../controllers/GroupController.js'

export const insert = (req, res, next) => {
  GroupController.insert(req, res, next).catch(next)
}

export const search = (req, res, next) => {
  GroupController.search(req, res, next).catch(next)
}

export const update = (req, res, next) => {
  GroupController.update(req, res, next).catch(next)
}

export const remove = (req, res, next) => {
  GroupController.remove(req, res, next).catch(next)
}
