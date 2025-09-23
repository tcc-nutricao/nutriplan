import { GroupService } from '../services/GroupService.js'
import { AppError } from '../exceptions/AppError.js'
import { formatZodErrors } from '../utils/formatZodErrors.js'
import { CreateGroupSchema } from '../dtos/group/CreateGroupDto.js'

export const GroupController = {
  async search (req, res, next)  {
    try {
      const { data, total } = await GroupService.search(req.query)
      return res.status(200).json({ data, total })
    } catch (err) {
      next(err)
    }
  },
  async insert (req, res, next) {
    try {
      const data = req.body
  
      const parseResult = CreateGroupSchema.safeParse(data)
      
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }
  
      const group = await GroupService.insert(data)
      return res.status(201).json(group)
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
  
      const parseResult = CreateGroupSchema.safeParse(data)
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
  
      const group = await GroupService.update(id, updateData)
      return res.status(200).json(group)
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
  
      const deletedUser = await GroupService.remove(Number(id));
      if (!deletedUser) {
        return res.status(404).json({
          errors: [{ message: 'Grupo não encontrado.' }]
        })
      }
  
      return res.status(200).json({ message: 'Grupo removido com sucesso.' });
    } catch (err) {
      next(err)
    }
  }
}


