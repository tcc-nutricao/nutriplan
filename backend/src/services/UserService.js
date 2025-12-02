import { UserRepository } from '../repositories/UserRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { generateCrudService } from './Service.js'

import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { useSendMail } from '../utils/useSendMail.js'

const prisma = new PrismaClient()

const insert = async (data) => {
  let existing = null;
  if (data.email) {
    existing = await UserRepository.findByEmail(data.email)
    
    if (existing && !existing.deleted_at) {
      throw new AppError({
        statusCode: 400,
        message: 'Email já cadastrado',
        field: 'email'
      })
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const result = await prisma.$transaction(async (tx) => {
    let user;

    if (existing && existing.deleted_at) {
      user = await UserRepository.update(existing.id, {
        ...data,
        password: hashedPassword,
        deleted_at: null
      })
      
      if (user.role === 'STANDARD') {
        const patient = await PatientRepository.findByUserId(user.id)
        if (patient) {
           await prisma.patient.update({
             where: { id: patient.id },
             data: { 
               deleted_at: null,
               weight: 0,
               height: 0,
               gender: 'NONE',
               birth_date: new Date()
             }
           })

           const now = new Date()
           await tx.healthData.updateMany({
             where: { id_patient: patient.id },
             data: { deleted_at: now }
           })
           await tx.goal.updateMany({
             where: { id_patient: patient.id },
             data: { deleted_at: now }
           })
           await tx.patientDietaryRestriction.updateMany({
             where: { id_patient: patient.id },
             data: { deleted_at: now }
           })

        } else {
           await PatientRepository.create({ id_user: user.id }, tx)
        }
      } else {
        const nutritionist = await NutritionistRepository.findByUserId(user.id)
        if (nutritionist) {
           await prisma.nutritionist.update({
             where: { id: nutritionist.id },
             data: { deleted_at: null, professional_register: user.professional_register ?? null }
           })
        } else {
           await NutritionistRepository.create({ id_user: user.id, professional_register: user.professional_register ?? null }, tx)
        }
      }

    } else {
      user = await UserRepository.create(
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
    }

    return user
  })

  try {
    if (data.email) {
      const isProfessional = result.role === 'PROFESSIONAL';
      
      const subject = isProfessional 
        ? 'Bem-vindo ao Nutriplan Profissional!' 
        : 'Bem-vindo ao Nutriplan!';
        
      const text = isProfessional
        ? `Olá ${data.name},\n\nSeja bem-vindo ao Nutriplan! Estamos muito felizes em tê-lo como parceiro.\n\nAcesse sua conta para começar a gerenciar seus pacientes e criar planos alimentares.`
        : `Olá ${data.name},\n\nSeja bem-vindo ao Nutriplan! Estamos muito felizes em tê-lo conosco.\n\nAcesse sua conta e cadastre seus dados pessoais para começar a usar o sistema!`;

      const htmlBody = isProfessional
        ? `<p style="font-size: 16px; color: #333333; line-height: 1.5;">Estamos muito felizes em tê-lo como parceiro! O Nutriplan é a ferramenta ideal para você criar planos alimentares, gerenciar seus pacientes e acompanhar a evolução de cada um.</p>
           <p style="font-size: 16px; color: #333333; line-height: 1.5;">Acesse sua conta para começar a transformar a vida dos seus pacientes.</p>`
        : `<p style="font-size: 16px; color: #333333; line-height: 1.5;">Estamos muito felizes em ter você conosco! O Nutriplan foi criado para te ajudar a alcançar seus objetivos de saúde de forma simples e eficiente.</p>
           <p style="font-size: 16px; color: #333333; line-height: 1.5;">Acesse sua conta e cadastre seus dados pessoais para começar a usar o sistema!</p>`;

      await useSendMail({
        to: data.email,
        subject,
        text,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #4A148C; text-align: center; margin-bottom: 20px;">${subject}</h2>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">Olá <strong>${data.name}</strong>,</p>
            ${htmlBody}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888888; text-align: center;">© ${new Date().getFullYear()} Nutriplan. Todos os direitos reservados.</p>
          </div>
        `
      })
    }
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error)
  }

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


    const updateData = data.profile_picture
      ? { profile_picture: data.profile_picture.split(',')[1] }
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
    if (data.email) {
      const existing = await UserRepository.findByEmail(data.email)
      if (existing) {
        throw new AppError({ message: 'Email já cadastrado', statusCode: 400, field: 'email' })
      }
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

    if (data.email) {
      await useSendMail({
        to: data.email,
        subject: 'Cadastro temporário no sistema',
        text: `Olá ${data.name},\n\nSeu cadastro temporário foi criado!\nE-mail: ${data.email}\nSenha temporária: ${randomPassword}\n\nTroque sua senha ao acessar o sistema.`
      })
    }
    
    return result
  } catch (error) {
    throw error
  }
}

const inviteUser = async (userId, email) => {
  try {
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      throw new AppError({ message: 'Usuário não encontrado', statusCode: 404 });
    }

    if (existingUser.email) {
      throw new AppError({ message: 'Usuário já possui email cadastrado', statusCode: 400 });
    }

    const emailInUse = await UserRepository.findByEmail(email);
    if (emailInUse) {
      throw new AppError({ message: 'Email já cadastrado', statusCode: 400, field: 'email' });
    }

    const nameLower = existingUser.name.toLowerCase().replace(/\s+/g, '');
    const randomPassword = `${nameLower}${Math.random().toString(36).slice(-4)}`;
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const updatedUser = await UserRepository.update(userId, {
      email,
      password: hashedPassword
    });

    await useSendMail({
      to: email,
      subject: 'Convite para o Nutriplan',
      text: `Olá ${existingUser.name},\n\nSeu nutricionista te convidou para acessar o Nutriplan!\n\nE-mail: ${email}\nSenha temporária: ${randomPassword}\n\nAcesse o sistema e troque sua senha.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #4A148C; text-align: center; margin-bottom: 20px;">Convite para o Nutriplan</h2>
          <p style="font-size: 16px; color: #333333; line-height: 1.5;">Olá <strong>${existingUser.name}</strong>,</p>
          <p style="font-size: 16px; color: #333333; line-height: 1.5;">Seu nutricionista te convidou para acessar o Nutriplan! Agora você poderá acompanhar seu plano alimentar e evolução diretamente pelo aplicativo.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Senha temporária:</strong> ${randomPassword}</p>
          </div>
          <p style="font-size: 16px; color: #333333; line-height: 1.5;">Acesse o sistema e troque sua senha no primeiro acesso.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888888; text-align: center;">© ${new Date().getFullYear()} Nutriplan. Todos os direitos reservados.</p>
        </div>
      `
    });

    return { message: 'Convite enviado com sucesso' };
  } catch (error) {
    throw error;
  }
};

export const UserService = {
  ...generateCrudService(UserRepository),
  insert,
  update, 
  remove,
  createTemporaryUser,
  getProfilePicture,
  inviteUser
}
