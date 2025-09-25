import { GroupService } from '../services/GroupService.js'
import { CreateGroupSchema } from '../dtos/group/CreateGroupDto.js'
import { generateCrudController } from './Controller.js'

export const GroupController = generateCrudController(
  GroupService,
  CreateGroupSchema,
  'Grupo'
)


