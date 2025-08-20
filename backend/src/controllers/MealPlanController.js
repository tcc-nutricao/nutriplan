import { MealPlanService } from '../services/MealPlanService.js'
import { AppError } from '../exceptions/AppError.js'
import { formatZodErrors } from '../utils/formatZodErrors.js'
import { CreateMealPlanSchema } from '../dtos/mealPlan/CreateMealPlanDto.js'

export const MealPlanController = {
  async search (req, res, next)  {
    try {
      const { filters, limit, page, order } = req.body
      const { data, total } = await MealPlanService.search(filters, limit, page, order);
      return res.status(200).json({ data, total });
    } catch (err) {
      next(err)
    }
  },
  async insert (req, res, next) {
    try {
      const data = req.body
  
      const parseResult = CreateMealPlanSchema.safeParse(data)
      
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }
  
      const user = await MealPlanService.insert(data)
      return res.status(201).json(user)
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: true, data: err.details })
      }
      next(err)
    }
  },
  async update (req, res, next)  {
    try {
      const data = req.body
  
      const parseResult = CreateMealPlanSchema.safeParse(data)
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }
  
      const { id, ...updateData } = data
      if (!id) {
        return res.status(400).json({
          errors: [{ message: 'ID não informado.' }]
        })
      }
  
      const user = await MealPlanService.update(id, updateData)
      return res.status(200).json(user)
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: true, data: err.details })
      }
      next(err)
    }
  },
  async remove (req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          errors: [{ message: 'ID não informado.' }]
        })
      }
  
      const deletedUser = await MealPlanService.remove(Number(id));
      if (!deletedUser) {
        return res.status(404).json({
          errors: [{ message: 'Usuário não encontrado.' }]
        })
      }
  
      return res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (err) {
      next(err)
    }
  }
}


