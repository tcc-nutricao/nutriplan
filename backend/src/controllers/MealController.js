import { MealService } from '../services/MealService.js';
import { CreateMealSchema } from '../dtos/meal/CreateMealDto.js';
import { generateCrudController } from './Controller.js';

export const MealController = {
  ...generateCrudController(MealService, CreateMealSchema, 'Refeição')
};

