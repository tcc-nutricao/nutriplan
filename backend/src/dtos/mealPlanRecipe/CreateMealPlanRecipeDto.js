import { z } from 'zod';

export const CreateMealPlanRecipeSchema = z.object({
    id_recipe: z.number().int().positive({
        message: "O ID da receita deve ser um número inteiro positivo"
    }),
    id_meal_plan_meal: z.number().int().positive({
        message: "O ID da refeição do plano deve ser um número inteiro positivo"
    }),
    favorite: z.boolean().optional().default(false)
});
