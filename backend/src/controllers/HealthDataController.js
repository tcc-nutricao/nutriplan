import { HealthDataService } from '../services/HealthDataService.js'
import { AppError } from '../exceptions/AppError.js'
import { formatZodErrors } from '../utils/formatZodErrors.js'
import { CreateHealthDataSchema } from '../dtos/healthData/CreateHealthDataDto.js'

export const HealthDataController = {
  async search (req, res, next)  {
    try {
      const { data, total } = await HealthDataService.search(req.query)
      return res.status(200).json({ data, total })
    } catch (err) {
      next(err)
    }
  },
  async insert (req, res, next) {
    try {
      const data = req.body
  
      const parseResult = CreateHealthDataSchema.safeParse(data)
      
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }
  
      const healthData = await HealthDataService.insert(data)
      return res.status(201).json(healthData)
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
  
      const parseResult = CreateHealthDataSchema.safeParse(data)
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
  
      const healthData = await HealthDataService.update(id, updateData)
      return res.status(200).json(healthData)
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
  
      const deletedUser = await HealthDataService.remove(Number(id));
      if (!deletedUser) {
        return res.status(404).json({
          errors: [{ message: 'Health Data não encontrado.' }]
        })
      }
  
      return res.status(200).json({ message: 'Health Data removido com sucesso.' });
    } catch (err) {
      next(err)
    }
  }
}


