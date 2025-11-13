import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { generateCrudService } from './Service.js'

import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { useSendMail } from '../utils/useSendMail.js'

const prisma = new PrismaClient()

// Método customizado para inserção de usuário
const insert = async (data) => {
  const existing = await UserRepository.findByEmail(data.email)
  if (existing) {
    throw new AppError('Email já cadastrado', 400, {
      emailInUse: 'Este e-mail já está em uso.'
    })
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const result = await prisma.$transaction(async (tx) => {
    const user = await UserRepository.create(
      { ...data, password: hashedPassword },
      tx
    )

    const { role, id: idUser, professional_register: professionalRegister } = user

    if (!['STANDARD', 'PROFESSIONAL'].includes(role)) {
      throw new AppError('Role inválida', 400)
    }

    if (role === 'STANDARD') {
      await PatientRepository.create({ id_user: idUser }, tx)
    } else {
      await NutritionistRepository.create({ id_user: idUser, professional_register: professionalRegister ?? null }, tx)
    }

    return user
  })

  return result
}

const update = async (data, userId) => {
  try {
    const existingUser = await UserRepository.findById(userId)
    if (!existingUser) {
      throw new AppError('Usuário não encontrado', 404)
    }

    if (data.email && data.email !== existingUser.email) {
      const emailInUse = await UserRepository.findByEmail(data.email)
      if (emailInUse) {
        throw new AppError('Email já cadastrado', 400, {
          emailInUse: 'Este e-mail já está em uso.'
        })
      }
    }

    const updateData = {
      name: data.name,
      email: data.email,
    }

    if (data.currentPassword && data.newPassword) {
      console.log(existingUser.password, data.currentPassword)
      const currentPasswordMatches = await bcrypt.compare(data.currentPassword, existingUser.password)

      if (!currentPasswordMatches) {
        throw new AppError('Senha antiga incorreta', 400, {
          currentPassword: 'A senha antiga está incorreta.'
        })
      }

      updateData.password = await bcrypt.hash(data.newPassword, 10)
      delete data.currentPassword
      delete data.newPassword
    }

    const result = await UserRepository.update(userId, updateData)

    return result

  } catch (error) {
    throw error
  }
}

const createTemporaryUser = async (data) => {
  try {
    const existing = await UserRepository.findByEmail(data.email)
    if (existing) {
      throw new AppError('Email já cadastrado', 400, {
        emailInUse: 'Este e-mail já está em uso.'
      })
    }

  const nameLower = data.name.toLowerCase().replace(/\s+/g, '')
  const randomPassword = `${nameLower}${Math.random().toString(36).slice(-4)}`
  const hashedPassword = await bcrypt.hash(randomPassword, 10)
  const role = 'STANDARD'

    const result = await prisma.$transaction(async (tx) => {
      const user = await UserRepository.create(
        { ...data, password: hashedPassword, role },
        tx
      )

      const { id: idUser } = user

      await PatientRepository.create({ id_user: idUser }, tx)
      
      return { ...user, temporaryPassword: randomPassword }
    })

    await useSendMail({
      to: data.email,
      subject: 'Cadastro temporário no sistema',
      text: `Olá ${data.name},\n\nSeu cadastro temporário foi criado!\nE-mail: ${data.email}\nSenha temporária: ${randomPassword}\n\nTroque sua senha ao acessar o sistema.`
    })
    
    return result
  } catch (error) {
    throw error
  }
}

export const UserService = {
  ...generateCrudService(UserRepository),
  insert,
  update, 
  createTemporaryUser
}


