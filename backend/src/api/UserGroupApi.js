import { UserGroupController } from '../controllers/UserGroupController.js';
import { generateCrudApi } from './Api.js';

export const api = {
  ...generateCrudApi(UserGroupController),
};
