import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'

import { AppError } from '../exceptions/AppError.js'
import bcrypt from 'bcrypt'

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

      const result = await prisma.$transaction(async (prismaTx) => {
        const user = await prismaTx.user.create({
          data: {
            ...data,
            password: hashedPassword
          }
        })

        const { role, id: idUser } = user

        if (!['STANDARD', 'NUTRITIONIST'].includes(role)) {
          throw new AppError('Role inválida', 400)
        }

        if (role === 'STANDARD') {
          await prismaTx.patient.create({ data: { idUser: idUser, created_at: new Date() } })
        } else {
          await prismaTx.nutritionist.create({
            data: { id_user: idUser, professional_register: null, created_at: new Date() }
          })
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


