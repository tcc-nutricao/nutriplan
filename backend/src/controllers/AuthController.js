import { LoginUserSchema } from '../dtos/user/LoginUserDto.js';
import { AuthService } from '../services/AuthService.js';
import { formatZodErrors } from '../utils/formatZodErrors.js';
import { AppError } from '../exceptions/AppError.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      console.log('aaa');
      
      const parsedResult = LoginUserSchema.safeParse(req.body);

      if (!parsedResult.success) {
        const errors = formatZodErrors(parsedResult.error);
        return res.status(422).json({ error: true, data: errors });
      }

      const result = await AuthService.login(parsedResult.data);
      return res.status(200).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: true, data: err.details });
      }

      next(err);
    }
  }
}
