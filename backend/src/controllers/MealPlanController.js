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
        // console.log('Logged in Nutritionist:', nutritionist)
        if (nutritionist) {
          filters.push({
            field: 'id_nutritionist',
            value: nutritionist.id,
            operator: 'equals'
          })
        } else {
            console.log('No nutritionist found for user:', userId)
        }
      }

      queryParams.filters = filters

      const { data, total } = await MealPlanService.search(queryParams)
      // console.log('MealPlanController search result:', { dataLength: data?.length, total })
      return res.status(200).json({ success: true, data, total })
    } catch (error) {
      console.error('Erro ao buscar planos alimentares:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      })
    }
  },
  update,
  getMealPlanByPatient,

  generateAutomaticPlan: async (req, res) => {
    try {
      const { id: userId, role } = req.user;
      const { patientId } = req.body;

      if (role !== 'PROFESSIONAL') {
        return res.status(403).json({ success: false, message: 'Apenas nutricionistas podem gerar planos automáticos.' });
      }

      const nutritionist = await NutritionistRepository.findByUserId(userId);
      if (!nutritionist) {
        return res.status(404).json({ success: false, message: 'Nutricionista não encontrado.' });
      }

      const result = await MealPlanService.generateAutomaticPlan(patientId, nutritionist.id);
      return res.status(201).json({ success: true, data: result });

    } catch (error) {
      console.error('Erro ao gerar plano automático:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  },

  assignPlan: async (req, res) => {
    try {
      const { id } = req.params; 
      const { patientId } = req.body;

      if (!id || !patientId) {
        return res.status(400).json({ success: false, message: 'ID do plano e ID do paciente são obrigatórios.' });
      }

      const result = await MealPlanService.assignPlanToPatient(Number(id), patientId);
      return res.status(200).json({ success: true, data: result });

    } catch (error) {
      console.error('Erro ao atribuir plano:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  },

  generateSelfService: async (req, res) => {
    try {
      const { id: userId } = req.user

      const patient = await PatientRepository.findByUserId(userId)
      
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        })
      }

      if (patient.id_nutritionist) {
        return res.status(403).json({
          success: false,
          message: 'Você possui um nutricionista vinculado. Solicite um plano a ele.'
        })
      }

      // ID 1 = NUTRIPLAN 
      const newPlan = await MealPlanService.generateAutomaticPlan(patient.id, 1)

      return res.status(201).json({
        success: true,
        data: newPlan,
        message: 'Plano alimentar gerado com sucesso!'
      })

    } catch (error) {
      console.error('Erro ao gerar plano self-service:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao gerar plano'
      })
    }
  },

  updateFull: async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      const user = req.user

      const result = await MealPlanService.updateWithRelations(id, data, user)

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Plano alimentar atualizado com sucesso!'
      })

    } catch (error) {
      console.error('Erro ao atualizar plano (full):', error)
      return res.status(500).json({
        success: false,
        field: error.field || null,
        message: error.message || 'Erro ao atualizar plano'
      })
    }
  },

  deletePlan: async (req, res) => {
    try {
      const { id } = req.params
      const user = req.user

      await MealPlanService.deletePlan(id, user)

      return res.status(200).json({
        success: true,
        message: 'Plano alimentar excluído com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao apagar plano:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao apagar plano'
      })
    }
  }
}
