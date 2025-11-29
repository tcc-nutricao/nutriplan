import { PatientService } from '../services/PatientService.js'
import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { CreatePatientSchema } from '../dtos/patient/CreatePatientDto.js'
import { generateCrudController } from './Controller.js'

const getProgress = async (req, res) => {
  try {
    const { id } = req.user; 
    // console.log(id)
    
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
      field: error.field || null,
      message: error.message || 'Erro interno do servidor' 
    })
  }
}

const createFull = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const patientData = req.body;

    const nutritionist = await NutritionistRepository.findByUserId(userId);

    if (!nutritionist) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de nutricionista não encontrado para este usuário.'
      });
    }

    const newPatient = await PatientService.createFullPatient(nutritionist.id, patientData);

    return res.status(201).json({
      success: true,
      data: newPatient
    });
  } catch (error) {
    console.error('Erro ao criar paciente completo:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
}

const getAll = async (req, res) => {
  try {
    const { id: userId } = req.user;
    console.log('getAll - userId:', userId);
    const nutritionist = await NutritionistRepository.findByUserId(userId);
    console.log('getAll - nutritionist:', nutritionist);

    if (!nutritionist) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de nutricionista não encontrado para este usuário.'
      });
    }

    const patients = await PatientService.getAllByNutritionist(nutritionist.id);
    console.log('getAll - patients found:', patients.length);

    return res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    console.error('Erro ao buscar pacientes do nutricionista:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    await PatientService.updatePatient(id, data);

    return res.status(200).json({
      success: true,
      message: 'Paciente atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
}

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    
    const nutritionist = await NutritionistRepository.findByUserId(userId);
    if (!nutritionist) {
      return res.status(404).json({
        success: false,
        message: 'Nutricionista não encontrado'
      });
    }

    const result = await PatientService.deleteOrUnlink(id, nutritionist.id);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erro ao excluir/desvincular paciente:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
}

export const PatientController = {
  ...generateCrudController(
    PatientService,
    CreatePatientSchema,
    'Paciente'
  ),
  getProgress,
  createFull,
  getAll,
  update,
  deletePatient
}


