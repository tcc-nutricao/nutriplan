import { RecipeService } from '../services/RecipeService.js'
import { FoodService } from '../services/FoodService.js'
import { PatientService } from '../services/PatientService.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const searchRecipes = async (req, res) => {
  try {
    const { q } = req.query
    const limit = parseInt(req.query.limit) || 10

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Termo de pesquisa é obrigatório'
      })
    }

    const result = await RecipeService.searchByTerm(q, limit)

    return res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      showing: result.data.length
    })
  } catch (error) {
    console.error('Erro ao pesquisar receitas:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

const searchFoods = async (req, res) => {
  try {
    const { q } = req.query
    const limit = parseInt(req.query.limit) || 10

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Termo de pesquisa é obrigatório'
      })
    }

    const result = await FoodService.searchByTerm(q, limit)

    return res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      showing: result.data.length
    })
  } catch (error) {
    console.error('Erro ao pesquisar alimentos:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

const searchPatients = async (req, res) => {
  try {
    const { q } = req.query
    const limit = parseInt(req.query.limit) || 10
    const { id: userId } = req.user // ID do usuário logado

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Termo de pesquisa é obrigatório'
      })
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não autenticado'
      })
    }

    // Buscar o ID do nutricionista a partir do ID do usuário
    const nutritionist = await prisma.nutritionist.findUnique({
      where: { id_user: userId },
      select: { id: true }
    })

    if (!nutritionist) {
      return res.status(404).json({
        success: false,
        message: 'Nutricionista não encontrado'
      })
    }

    const result = await PatientService.searchByTerm(q, nutritionist.id, limit)

    return res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      showing: result.data.length
    })
  } catch (error) {
    console.error('Erro ao pesquisar pacientes:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

export const SearchController = {
  searchRecipes,
  searchFoods,
  searchPatients
}
