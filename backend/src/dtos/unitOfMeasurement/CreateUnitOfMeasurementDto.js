import { z } from 'zod';

export const CreateUnitOfMeasurementSchema = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório',
    invalid_type_error: 'Nome deve ser string'
  }).min(1, { message: 'Nome não pode ser vazio' }),
  symbol: z.string().optional().nullable(),
  created_at: z.preprocess((v) => (v ? new Date(v) : new Date()), z.date()),
  deleted_at: z.preprocess((v) => (v ? new Date(v) : undefined), z.date().optional()),
  updated_at: z.preprocess((v) => (v ? new Date(v) : new Date()), z.date())
});

export const createUnitOfMeasurementValidate = (data) => CreateUnitOfMeasurementSchema.parse(data);
