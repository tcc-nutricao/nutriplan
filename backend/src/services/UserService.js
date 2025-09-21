import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'

import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const UserService = {
  async search (object) {
    const { data = [], total = 0 } = await UserRepository.search(object)
    return { data, total }
  },

  async insert(data) {
    try {
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
          await NutritionistRepository.create({ id_user: idUser, professional_register: professionalRegister }, tx)
        }

        return user
      })

      return result
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async update (id, data) {
    try {
      const existing = await UserRepository.findByEmail(data.email)
  
      if (existing && id !== existing.id) {
        throw new AppError('Email já cadastrado', 400, { emailInUse: 'Este e-mail já está em uso.' })
      }
  
      return await UserRepository.update(id, data)
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async remove (id) {
    try {
      return await UserRepository.remove(id)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}


