import { NutritionistService } from '../services/NutritionistService.js'
import { CreateNutritionistSchema } from '../dtos/nutritionist/CreateNutritionistDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan ...
const getPatients = async (req, res) => {
  try {
    const { id } = req.user
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do nutricionista é obrigatório' 
      })
    }

    const patients = await NutritionistService.getPatients(parseInt(id))
    
    return res.status(200).json({ 
      success: true, 
      data: patients 
    })
  } catch (error) {
    console.error('Erro ao buscar pacientes do nutricionista:', error)
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

// Mescla CRUD padrão com métodos customizados
export const NutritionistController = {
  ...generateCrudController(
    NutritionistService,
    CreateNutritionistSchema,
    'Nutricionista'
  ),
  getPatients
}


