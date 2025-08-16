import { UserController } from '../controllers/UserController.js';

export const insert = (req, res, next) => {
  UserController.insert(req, res, next).catch(next);
}

export const search = (req, res, next) => {
  UserController.search(req, res, next).catch(next);
}

export const update = (req, res, next) => {
  UserController.update(req, res, next).catch(next);
}

export const remove = (req, res, next) => {
  UserController.remove(req, res, next).catch(next);
}
