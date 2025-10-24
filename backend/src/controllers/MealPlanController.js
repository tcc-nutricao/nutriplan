import { MealPlanService } from '../services/MealPlanService.js'
import { CreateMealPlanSchema } from '../dtos/mealPlan/CreateMealPlanDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do MealPlan
const getMealPlanByPatient = async (req, res) => {
  try {
    const { patientId } = req.params
    
    if (!patientId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do paciente é obrigatório' 
      })
    }

    const mealPlansData = await MealPlanService.getMealPlanByPatient(parseInt(patientId))
    
    return res.status(200).json({ 
      success: true, 
      data: mealPlansData.data,
      total: mealPlansData.total,
      message: mealPlansData.message || null
    })
  } catch (error) {
    console.error('Erro ao buscar planos do paciente:', error)
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

// Mescla CRUD padrão com métodos customizados
export const MealPlanController = {
  ...generateCrudController(
    MealPlanService,
    CreateMealPlanSchema,
    'Plano alimentar'
  ),
  getMealPlanByPatient
}


