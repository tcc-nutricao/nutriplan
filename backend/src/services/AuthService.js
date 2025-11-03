import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
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
  
  let nextPage = '/meal-plan' 

    if (user.role === 'PROFESSIONAL') {
      nextPage = '/professional/patients'
    } else if (user.role === 'STANDARD') {
      const patient = await PatientRepository.findByUserId(user.id)
      
      if (!patient) {
        nextPage = '/register-personal-data'
      } else if (patient.weight === 0) {
        nextPage = '/register-personal-data'
      } else {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

        if (patient.updated_at < oneMonthAgo) {
          nextPage = '/register-personal-data'
        }
      }
    }

    const payload = { id: user.id, email: user.email, role: user.role } 
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  
    return {
      message: 'Login bem-sucedido',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role 
      },
      nextPage: nextPage
    }
  }
}


