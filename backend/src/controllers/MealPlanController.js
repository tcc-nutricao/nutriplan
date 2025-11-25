import { MealPlanService } from '../services/MealPlanService.js'
import { CreateMealPlanSchema } from '../dtos/mealPlan/CreateMealPlanDto.js'
import { generateCrudController } from './Controller.js'

import { PatientRepository } from '../repositories/PatientRepository.js'

const getMealPlanByPatient = async (req, res) => {
  try {
    const { id: userId } = req.user
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do usuário é obrigatório' 
      })
    }

    const patient = await PatientRepository.findByUserId(userId)
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado para este usuário'
      })
    }

    const mealPlansData = await MealPlanService.getMealPlanByPatient(patient.id)
    
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
      field: error.field || null,
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const user = req.user
    const data = req.body

    const result = await MealPlanService.update(id, data, user)
    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error('Erro ao atualizar plano alimentar:', error)
    return res.status(500).json({
      success: false,
      field: error.field || null,
      message: error.message || 'Erro interno do servidor'
    })
  }
}

export const MealPlanController = {
  ...generateCrudController(
    MealPlanService,
    CreateMealPlanSchema,
    'Plano alimentar'
  ),
  update,
  getMealPlanByPatient
}


