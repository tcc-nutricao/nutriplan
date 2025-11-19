import { z } from 'zod';

export const UpdateGroupSchema = z.object({
  name: z.string().optional(),
  
  picture: z.string().optional().nullable(),

  end_date: z.union([z.string(), z.date()]).optional().nullable(),
  
  updated_at: z.preprocess(
    (val) => val ? new Date(val) : new Date(),
    z.date()
  ),
});