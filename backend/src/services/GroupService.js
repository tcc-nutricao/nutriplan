import { GroupRepository } from '../repositories/GroupRepository.js'
import { generateCrudService } from './Service.js'

export const GroupService = generateCrudService(GroupRepository)


