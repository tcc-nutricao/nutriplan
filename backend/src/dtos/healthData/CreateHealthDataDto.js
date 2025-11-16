import { z } from 'zod';

export const CreateHealthDataSchema = z.object({
  id_patient: z.number({
    required_error: 'ID do paciente é obrigatório',
    invalid_type_error: 'ID do paciente deve ser número'
  }).int().positive(),
  height: z.number({
    required_error: 'Altura é obrigatória',
    invalid_type_error: 'Altura deve ser número'
  }).positive({ message: 'Altura deve ser um valor positivo' }),
  weight: z.number({
    required_error: 'Peso é obrigatório',
    invalid_type_error: 'Peso deve ser número'
  }).positive({ message: 'Peso deve ser um valor positivo' }),
  bmi: z.number({
    required_error: 'IMC é obrigatório',
    invalid_type_error: 'IMC deve ser número'
  }).positive({ message: 'IMC deve ser um valor positivo' }),
  record_date: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date({ required_error: 'Data de registro é obrigatória' })
  ),
  created_at: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
  deleted_at: z.preprocess((val) => (val ? new Date(val) : undefined), z.date().optional()),
  updated_at: z.preprocess((val) => (val ? new Date(val) : undefined), z.date().optional())
});

export const createHealthDataValidate = (data) => CreateHealthDataSchema.parse(data);
