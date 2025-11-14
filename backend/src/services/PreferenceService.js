import { PreferenceRepository } from '../repositories/PreferenceRepository.js';
import { generateCrudService } from './Service.js';

export const PreferenceService = generateCrudService(PreferenceRepository);