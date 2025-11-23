import { RecipeService } from '../services/RecipeService.js'
import { CreateRecipeSchema } from '../dtos/recipe/CreateRecipeDto.js'
import { generateCrudController } from './Controller.js'

const getPatientRecipes = async (req, res) => {
  try {
    const { id } = req.user
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do paciente é obrigatório'
      })
    }

    const recipes = await RecipeService.getPatientRecipes(parseInt(id))

    return res.status(200).json({
      success: true,
      data: recipes
    })
  } catch (error) {
    console.error('Erro ao buscar receitas do paciente:', error)
    return res.status(500).json({
      success: false,
      field: error.field || null,
      message: error.message || 'Erro interno do servidor'
    })
  }
}


const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.user
    const { recipeId } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário é obrigatório'
      })
    }

    if (!recipeId) {
      return res.status(400).json({
        success: false,
        message: 'ID da receita é obrigatório'
      })
    }

    const result = await RecipeService.toggleFavorite(parseInt(id), parseInt(recipeId))

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Erro ao alternar favorito:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

const getFavorites = async (req, res) => {
  try {
    const { id } = req.user

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário é obrigatório'
      })
    }

    const favorites = await RecipeService.getFavorites(parseInt(id))

    return res.status(200).json({
      success: true,
      data: favorites
    })
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

const insert = async (req, res, next) => {
  try {
    let data = req.body

    const parseResult = CreateRecipeSchema.safeParse(data)
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      return res.status(422).json({ error: true, errors })
    }

    data = parseResult.data

    const result = await RecipeService.create(data)
    return res.status(201).json(result)
  } catch (err) {
    console.error('Erro no insert:', err)
    return res.status(500).json({
      error: true,
      message: err.message || 'Erro ao criar receita'
    })
  }
}

export const RecipeController = {
  ...generateCrudController(
    RecipeService,
    CreateRecipeSchema,
    'Receita'
  ),
  insert, // Override the generic insert method
  getPatientRecipes,
  toggleFavorite,
  getFavorites
}


