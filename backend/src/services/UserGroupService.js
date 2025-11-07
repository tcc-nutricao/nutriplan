import { UserGroupRepository } from '../repositories/UserGroupRepository.js';
import { generateCrudService } from './Service.js';

export const UserGroupService = generateCrudService(UserGroupRepository);
