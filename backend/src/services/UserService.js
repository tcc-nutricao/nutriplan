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
    throw new AppError({
      statusCode: 400,
      message: 'Email já cadastrado',
      field: 'email'
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
      throw new AppError({ message: 'Role inválida', statusCode: 400, field: 'role' })
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

const updateProfilePicture = async (data, userId) => {
  try {
    const updatePic = {
      profile_picture: data.profile_picture
    }

    const result = await UserRepository.updateProfilePicture(userId, updatePic)

    return result

  } catch (error) {
    throw error
  }
}


const update = async (data, userId) => {
  try {
    const existingUser = await UserRepository.findById(userId)
    if (!existingUser) {
      throw new AppError({ message: 'Usuário não encontrado', statusCode: 404 })
    }

    if (data.email && data.email !== existingUser.email) {
      const emailInUse = await UserRepository.findByEmail(data.email)
      if (emailInUse) {
        throw new AppError({ message: 'Email já cadastrado', statusCode: 400, field: 'email' })
      }
    }

    // data.profile_picture ? console.log('tem foto') : console.log('sem foto');

    const updateData = data.profile_picture
      ? { profile_picture: data.profile_picture.split(',')[1] } // Extrai apenas a string base64
      : {
          name: data.name,
          email: data.email
        };

    if (data.currentPassword && data.newPassword) {
      const currentPasswordMatches = await bcrypt.compare(data.currentPassword, existingUser.password)

      if (!currentPasswordMatches) {
        throw new AppError({ message: 'Senha antiga incorreta', statusCode: 400, field: 'currentPassword' })
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

const remove = async (userId) => {
  try {
    const existingUser = await UserRepository.findById(userId)
    if (!existingUser) {
      throw new AppError({ message: 'Usuário não encontrado', statusCode: 404 })
    }

    await UserRepository.remove(userId)

    return { message: 'Usuário apagado com sucesso' }
  } catch (error) {
    throw error
  }
}

const getProfilePicture = async (userId) => {
  try {
    // console.log('userId', userId)
    if (!userId) {
      throw new AppError({ message: 'ID do usuário não fornecido', statusCode: 400 });
    }

    const user = await UserRepository.findProfilePictureByUserId(userId);

    if (!user || !user.profile_picture) {
      throw new AppError({ message: 'Foto de perfil não encontrada', statusCode: 404 });
    }

    return user.profile_picture;
  } catch (err) {
    throw err;
  }
};


const createTemporaryUser = async (data) => {
  try {
    const existing = await UserRepository.findByEmail(data.email)
    if (existing) {
      throw new AppError({ message: 'Email já cadastrado', statusCode: 400, field: 'email' })
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
  remove,
  createTemporaryUser,
  getProfilePicture
}
