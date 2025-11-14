import { RestrictionRepository } from '../repositories/RestrictionRepository.js';
import { generateCrudService } from './Service.js';

export const RestrictionService = generateCrudService(RestrictionRepository);