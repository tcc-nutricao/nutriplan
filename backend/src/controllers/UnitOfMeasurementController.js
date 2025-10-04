import { UnitOfMeasurementService } from '../services/UnitOfMeasurementService.js';
import { CreateUnitOfMeasurementSchema } from '../dtos/unitOfMeasurement/CreateUnitOfMeasurementDto.js';
import { generateCrudController } from './Controller.js';

export const UnitOfMeasurementController = {
  ...generateCrudController(UnitOfMeasurementService, CreateUnitOfMeasurementSchema, 'Unidade de Medida')
};
