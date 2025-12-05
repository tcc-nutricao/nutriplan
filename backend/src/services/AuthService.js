import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { AppError } from '../exceptions/AppError.js'
import { useSendMail } from '../utils/useSendMail.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_segura'

export const needsInitialRegistration = async (userId) => {
  try {
    if (!userId) {
      throw new AppError({ message: 'ID do usuário é obrigatório', statusCode: 400, field: 'userId' })
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

    if (user?.deleted_at) {
      throw new AppError({ message: 'Conta desativada. Entre em contato com o suporte.', statusCode: 403, field: 'email' })
    }
  
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError({ message: 'E-mail ou senha inválidos', statusCode: 401, field: 'password' })
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
  },

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email)

    if (!user) {
      // Don't reveal that the user does not exist
       return { message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.' }
    }

    const token = crypto.randomBytes(20).toString('hex')
    const now = new Date()
    now.setHours(now.getHours() + 1) // 1 hour expiration

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: token,
        reset_password_expires: now
      }
    })

    const resetLink = `http://localhost:3000/reset-password?token=${token}`

    await useSendMail({
      to: email,
      subject: 'Redefinição de Senha - Nutriplan',
      html: `
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `
    })

    return { message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.' }
  },

  async resetPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
        where: {
            reset_password_token: token,
            reset_password_expires: {
                gt: new Date()
            }
        }
    })

    if (!user) {
        throw new AppError({ message: 'Token inválido ou expirado', statusCode: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            reset_password_token: null,
            reset_password_expires: null
        }
    })

    return { message: 'Senha redefinida com sucesso' }
  }
}
