import { LoginUserSchema } from '../dtos/user/LoginUserDto.js'
import { AuthService } from '../services/AuthService.js'
import { formatZodErrors } from '../utils/formatZodErrors.js'
import { AppError } from '../exceptions/AppError.js'

export const AuthController = {
  async login (req, res, next) {
    try {
      const parsedResult = LoginUserSchema.safeParse(req.body)

      if (!parsedResult.success) {
        const errors = formatZodErrors(parsedResult.error)
        return res.status(422).json({
          error: true,
          field: error.field || null,
          data: errors
        })
      }
  
      const result = await AuthService.login(parsedResult.data)

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      })

      return res.status(200).json({
        message: result.message,
        user: result.user,
        nextPage: result.nextPage
      })
    } catch (err) {
      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ error: true, data: err.details })
      }
  
      next(err)
    }
  },
  async logout(req, res, next) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      return res.status(200).json({ message: 'Logout realizado com sucesso' })
    } catch (err) {
      next(err)
    }
  }
}

