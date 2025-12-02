import { UserController } from '../controllers/UserController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(UserController),
  createTemporaryUser: UserController.createTemporaryUser,
  update: UserController.update,
  remove: UserController.remove,
  getProfilePicture: UserController.getProfilePicture,
  inviteUser: UserController.inviteUser
}