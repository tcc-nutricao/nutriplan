import { GroupController } from '../controllers/GroupController.js'
import { generateCrudApi } from './Api.js'

// Mescla CRUD padrão com métodos customizados do controller
export const api = {
  ...generateCrudApi(GroupController),
  getGroupsProgressByUser: GroupController.getGroupsProgressByUser
}