import { PatientService } from '../services/PatientService.js'
import { CreatePatientSchema } from '../dtos/patient/CreatePatientDto.js'
import { generateCrudController } from './Controller.js'

// Métodos customizados específicos do Patient
const getProgress = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do paciente é obrigatório' 
      })
    }

    const progressData = await PatientService.getProgress(parseInt(id))
    
    return res.status(200).json({ 
      success: true, 
      data: progressData 
    })
  } catch (error) {
    console.error('Erro ao buscar progresso do paciente:', error)
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

// Mescla CRUD padrão com métodos customizados
export const PatientController = {
  ...generateCrudController(
    PatientService,
    CreatePatientSchema,
    'Paciente'
  ),
  getProgress
}


