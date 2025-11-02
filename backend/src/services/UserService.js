import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { generateCrudService } from './Service.js'

import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

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

export const UserService = {
  ...generateCrudService(UserRepository),
  insert // Sobrescreve o insert padrão
}


