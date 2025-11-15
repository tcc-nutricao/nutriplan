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

export const RecipeController = {
  ...generateCrudController(
    RecipeService,
    CreateRecipeSchema,
    'Receita'
  ),
  getPatientRecipes
}


