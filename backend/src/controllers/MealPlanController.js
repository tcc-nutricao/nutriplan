import { MealPlanService } from '../services/MealPlanService.js'
import { CreateMealPlanSchema } from '../dtos/mealPlan/CreateMealPlanDto.js'
import { generateCrudController } from './Controller.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'

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
  insert: async (req, res) => {
    try {
      const { id: userId, role } = req.user
      const data = req.body

      let userWithRole = { ...req.user }
      
      if (role === 'PROFESSIONAL') {
        const nutritionist = await NutritionistRepository.findByUserId(userId)
        if (nutritionist) {
          userWithRole.id_nutritionist = nutritionist.id
          userWithRole.nutritionist = nutritionist
        }
      }

      const result = await MealPlanService.create(data, userWithRole)
      return res.status(201).json({ success: true, data: result })
    } catch (error) {
      console.error('Erro ao criar plano alimentar:', error)
      return res.status(500).json({
        success: false,
        field: error.field || null,
        message: error.message || 'Erro interno do servidor'
      })
    }
  },

  search: async (req, res) => {
    try {
      const { id: userId, role } = req.user
      let queryParams = { ...req.query }
      let filters = []

      // Parse existing filters if any
      if (queryParams.filters) {
        try {
          filters = typeof queryParams.filters === 'string' 
            ? JSON.parse(queryParams.filters) 
            : queryParams.filters
        } catch (e) {
          filters = []
        }
      }
      
      if (!Array.isArray(filters)) filters = []

      if (role === 'PROFESSIONAL') {
        const nutritionist = await NutritionistRepository.findByUserId(userId)
        if (nutritionist) {
          // Add nutritionist filter
          filters.push({
            field: 'id_nutritionist',
            value: nutritionist.id,
            operator: 'equals'
          })
        }
      }

      // Update queryParams with the new filters
      queryParams.filters = filters

      const { data, total } = await MealPlanService.search(queryParams)
      return res.status(200).json({ data, total })
    } catch (error) {
      console.error('Erro ao buscar planos alimentares:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      })
    }
  },
  update,
  getMealPlanByPatient
}
