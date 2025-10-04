import { z } from 'zod';

// Enum refletindo WeekDay do Prisma
export const WeekDayEnum = z.enum(['MON','TUE','WED','THU','FRI','SAT','SUN']);

export const CreateMealPlanMealSchema = z.object({
  id_meal_plan: z.number({
    required_error: 'id_meal_plan é obrigatório',
    invalid_type_error: 'id_meal_plan deve ser numérico'
  }).int().positive(),
  id_meal: z.number({
    required_error: 'id_meal é obrigatório',
    invalid_type_error: 'id_meal deve ser numérico'
  }).int().positive(),
  // Accept either "HH:MM" / "HH:MM:SS" string or Date and convert to Date
  time: z.preprocess((val) => {
    if (val === null || val === undefined || val === '') return undefined;
    if (val instanceof Date) return val;
    if (typeof val === 'string') {
      let raw = val.trim();
      if (!/^\d{2}:\d{2}(:\d{2})?$/.test(raw)) return undefined; // deixa o z.date() falhar depois
      if (raw.length === 5) raw += ':00';
      // Criamos um Date local e depois retornamos o próprio Date. Isso gera ISO válido para o cliente Prisma.
      const [hh, mm, ss] = raw.split(':');
      const d = new Date();
      d.setHours(Number(hh), Number(mm), Number(ss || 0), 0);
      // Zera a parte da data para consistência visual (opcional): usar epoch base
      d.setFullYear(1970, 0, 1);
      return d;
    }
    return val;
  }, z.date().optional()),
  day: WeekDayEnum.optional().nullable(),
  created_at: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date()
  ),
  deleted_at: z.preprocess(
    (val) => (val ? new Date(val) : undefined),
    z.date().optional()
  ),
  updated_at: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date()
  ),
});

// Helper para inferir tipo Typescript se necessário futuramente
export const createMealPlanMealValidate = (data) => CreateMealPlanMealSchema.parse(data);
