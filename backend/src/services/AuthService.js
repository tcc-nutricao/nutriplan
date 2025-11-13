import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from '../exceptions/AppError.js'

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_segura'

export const needsInitialRegistration = async (userId) => {
  try {
    if (!userId) {
      throw new AppError('ID do usuário não fornecido', 400, { userId: 'ID do usuário é obrigatório' })
    }

    const patient = await PatientRepository.findByUserId(userId)
    if (!patient) {
      return { needsInitialRegistration: true }
    }

    const lastHealthData = await HealthDataRepository.findActualByPatientId(patient.id)

    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const healthDataExpired = !lastHealthData || (lastHealthData.record_date && lastHealthData.record_date < oneYearAgo)
    const patientDataExpired = patient.updated_at && patient.updated_at < oneYearAgo

    const needsInitialRegistration = patient.weight === 0 || healthDataExpired || patientDataExpired

    return { needsInitialRegistration }
  } catch (error) {
    throw error
  }
}

export const AuthService = {
  async login (data) {
    const user = await UserRepository.findByEmail(data.email)

    if (user.deleted_at) {
      throw new AppError('Conta desativada. Entre em contato com o suporte.', 403, { accountDeactivated: 'Conta desativada. Entre em contato com o suporte.' })
    }
  
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError('E-mail ou senha inválidos', 401, { invalidCredentials: 'E-mail ou senha inválidos' })
    }
  
    let nextPage = '/meal-plan' 

    if (user.role === 'PROFESSIONAL') {
      nextPage = '/professional/patients'
    } else if (user.role === 'STANDARD') {
      const needsRegistration = await needsInitialRegistration(user.id)
      if (needsRegistration.needsInitialRegistration) {
        nextPage = '/register-personal-data'
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


