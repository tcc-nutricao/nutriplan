import { UserService } from '../services/UserService.js';
import { AppError } from '../exceptions/AppError.js';
import { formatZodErrors } from '../utils/formatZodErrors.js';
import { CreateUserSchema } from '../dtos/user/CreateUserDto.js';

export const UserController = {
  async search (req, res, next)  {
    try {
      const { data, total } = await UserService.search(req.query)
      return res.status(200).json({ data, total })
    } catch (err) {
      next(err);
    }
  },
  async insert (req, res, next) {
    try {
      const data = req.body
      data.role = translateRole(data.role)
  
      const parseResult = CreateUserSchema.safeParse(data)
      
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }
  
      const user = await UserService.insert(data)
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
      const { id } = req.params
      const data = req.body

      data.role = translateRole(data.role)

      const parseResult = CreateUserSchema.safeParse(data)
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }

      if (!id) {
        return res.status(400).json({
          errors: [{ message: 'ID não informado.' }]
        })
      }

      const user = await UserService.update(Number(id), data)
      return res.status(200).json(user)
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: true, data: err.details })
      }
      next(err);
    }
  },

  async remove (req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          errors: [{ message: 'ID não informado.' }]
        });
      }
  
      const deletedUser = await UserService.remove(Number(id));
      if (!deletedUser) {
        return res.status(404).json({
          errors: [{ message: 'Usuário não encontrado.' }]
        });
      }
  
      return res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (err) {
      next(err)
    }
  }
}

const translateRole = (role) =>  {
  const roleNames = [
    { label: 'Profissional', value: 'PROFESSIONAL' },
    { label: 'Padrão', value: 'STANDARD' }
  ]
  return roleNames.find(item => item.label === role)?.value ?? null
}
