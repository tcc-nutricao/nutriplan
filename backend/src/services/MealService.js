import { MealRepository } from '../repositories/MealRepository.js';
import { generateCrudService } from './Service.js';

export const MealService = generateCrudService(MealRepository);
