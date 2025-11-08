import { UnitOfMeasurementController } from '../controllers/UnitOfMeasurementController.js';
import { generateCrudApi } from './Api.js';

export const api = {
  ...generateCrudApi(UnitOfMeasurementController)
};
