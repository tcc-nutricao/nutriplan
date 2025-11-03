import { UserGroupService } from '../services/UserGroupService.js';
import { CreateUserGroupSchema } from '../dtos/userGroup/CreateUserGroupDto.js';
import { generateCrudController } from './Controller.js';

export const UserGroupController = {
  ...generateCrudController(UserGroupService, CreateUserGroupSchema, 'Grupo de Usuário')
};

