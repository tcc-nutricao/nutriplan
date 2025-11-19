import { GroupController } from '../controllers/GroupController.js'
import { generateCrudApi } from './Api.js'

export const api = {
  ...generateCrudApi(GroupController),
  create: GroupController.create,
  update: GroupController.update,
  getGroupsProgressByUser: GroupController.getGroupsProgressByUser
}