import { MealService } from '../services/MealService.js';
import { CreateMealSchema } from '../dtos/meal/CreateMealDto.js';
import { generateCrudController } from './Controller.js';

// Controller base usando Create para insert e Update para update através de custom wrapper

export const MealController = {
  ...generateCrudController(MealService, CreateMealSchema, 'Refeição')
};

// Caso queira validar update com schema diferente, poderíamos exportar algo customizado posteriormente.
