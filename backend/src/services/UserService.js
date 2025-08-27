import { UserRepository } from '../repositories/UserRepository.js'
import { AppError } from '../exceptions/AppError.js'
import bcrypt from 'bcrypt'

export const UserService = {
  async search (object) {
    return await UserRepository.search(object)
  },
  async insert (data) {
    try {
      const existing = await UserRepository.findByEmail(data.email)
  
      if (existing) {
        throw new AppError('Email já cadastrado', 400, { emailInUse: 'Este e-mail já está em uso.' })
      }
  
      const hashedPassword = await bcrypt.hash(data.password, 10);
  
      return await UserRepository.create({
        ...data,
        password: hashedPassword,
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async update (id, data) {
    try {
      const existing = await UserRepository.findByEmail(data.email)
  
      if (existing) {
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


