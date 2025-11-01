import { UserRepository } from '../repositories/UserRepository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from '../exceptions/AppError.js'

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_segura'

export const AuthService = {
  async login (data) {
    const user = await UserRepository.findByEmail(data.email)
  
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError('E-mail ou senha inválidos', 401, { invalidCredentials: 'E-mail ou senha inválidos' })
    }
  
    const payload = { id: user.id, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  
    return {
      message: 'Login bem-sucedido',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  }
}


