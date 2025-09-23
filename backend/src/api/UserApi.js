import { UserController } from '../controllers/UserController.js'
import { generateCrudApi } from './Api.js'

export const api = generateCrudApi(UserController)
