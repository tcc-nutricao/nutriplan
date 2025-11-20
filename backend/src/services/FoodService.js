import { FoodRepository } from '../repositories/FoodRepository.js'
import { generateCrudService } from './Service.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const baseCrudService = generateCrudService(FoodRepository)

export const FoodService = {
  ...baseCrudService,

  async searchByTerm(searchTerm, limit = 10) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return { data: [], total: 0 }
      }

      const where = {
        deleted_at: null,
        name: {
          contains: searchTerm.trim()
        }
      }

      const [data, total] = await Promise.all([
        prisma.food.findMany({
          where,
          take: limit,
          select: {
            id: true,
            name: true
          },
          orderBy: { name: 'asc' }
        }),
        prisma.food.count({ where })
      ])

      return { data, total }
    } catch (error) {
      console.error('Erro ao pesquisar alimentos:', error)
      throw error
    }
  }
}

