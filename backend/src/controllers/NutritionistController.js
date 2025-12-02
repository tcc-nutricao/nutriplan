import { NutritionistService } from '../services/NutritionistService.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
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
      field: error.field || null,
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

const getPatientInfo = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do paciente é obrigatório' 
      })
    }

    const patient = await NutritionistService.getPatientInfo(parseInt(id))

    return res.status(200).json({ 
      success: true, 
      data: patient 
    })
  } catch (error) {
    console.error('Erro ao buscar informações do paciente:', error)
    return res.status(500).json({ 
      success: false, 
      field: error.field || null,
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

export const NutritionistController = {
  ...generateCrudController(
    NutritionistService,
    CreateNutritionistSchema,
    'Nutricionista'
  ),
  getPatients,
  getPatientInfo,
  generateInviteCode: async (req, res) => {
    try {
      const { id } = req.user
      const result = await NutritionistService.generateInviteCode(parseInt(id))
      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      return res.status(error.statusCode || 500).json({ 
        success: false, 
        message: error.message || 'Erro ao gerar código' 
      })
    }
  },
  getInviteCode: async (req, res) => {
    try {
      const { id } = req.user
      const result = await NutritionistService.getInviteCode(parseInt(id))
      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      return res.status(error.statusCode || 500).json({ 
        success: false, 
        message: error.message || 'Erro ao buscar código' 
      })
    }
  },
  linkPatientByCode: async (req, res) => {
    try {
      const { id } = req.user
      const { code } = req.body
      
      const patient = await PatientRepository.findByUserId(parseInt(id))
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Paciente não encontrado' })
      }

      const result = await NutritionistService.linkPatientByCode(patient.id, code)
      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      return res.status(error.statusCode || 500).json({ 
        success: false, 
        message: error.message || 'Erro ao vincular paciente' 
      })
    }
  }
}


