import { UnitOfMeasurementRepository } from '../repositories/UnitOfMeasurementRepository.js';
import { generateCrudService } from './Service.js';

export const UnitOfMeasurementService = generateCrudService(UnitOfMeasurementRepository);
