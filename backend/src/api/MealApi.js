import { MealController } from '../controllers/MealController.js';
import { generateCrudApi } from './Api.js';

export const api = {
  ...generateCrudApi(MealController),
};
