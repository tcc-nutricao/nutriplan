import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'
import { AppError } from '../exceptions/AppError.js'


const getMealPlanByPatient = async (patientId, additionalFilters = []) => {
  try {
    if (!patientId) {
      throw new AppError({ message: 'Paciente não encontrado para o patientId fornecido' })
    }

    const filters = [
      { field: 'id_patient', value: patientId, operator: 'equals' },
      ...additionalFilters
    ]
    
    const { data: mealPlans = [], total } = await MealPlanRepository.search({ 
      filters
    })

    if (mealPlans.length === 0) {
      return { data: [], total: 0, message: 'Nenhum plano de refeição encontrado para este paciente' }
    }

    return { data: mealPlans, total }

  } catch (error) {
    console.error('Erro ao buscar meal plans do paciente:', error)
    throw error
  }
}

const getActiveMealPlanForPatient = async (patientId) => {
  try {
    if (!patientId) {
      throw new AppError({ message: 'ID do paciente é obrigatório' })
    }

    const filters = [
      { field: 'status', value: 'ACTIVE', operator: 'equals' },
      { field: 'id_patient', value: patientId, operator: 'equals' }
    ]
    const { data: mealPlans = [] } = await getMealPlanByPatient(patientId, filters)

    if (mealPlans.length === 0) {
      return { data: [], total: 0, message: 'Nenhum plano de refeição ativo encontrado' }
    }
    
    return mealPlans[0]
  } catch (error) {
    console.error('Erro ao buscar meal plan ativo:', error)
    throw error
  }
}

const update = async (id, data, user) => {
  const mealPlanId = parseInt(id, 10);
  const mealPlan = await MealPlanRepository.findById(mealPlanId);
  const patientId = mealPlan.id_patient;
  if (data.status === 'ACTIVE') {
    if (!mealPlan) throw new AppError('Plano alimentar não encontrado');
    await MealPlanRepository.updateMany({
      where: {
        id_patient: patientId,
        status: 'ACTIVE',
        id: { not: mealPlanId }
      },
      data: { status: 'COMPLETED' }
    });
  }

  const patient = await PatientRepository.findById(patientId);
  const canEdit = user.role === 'PROFESSIONAL' || !patient.id_nutritionist;

  if (canEdit) {
    return await MealPlanRepository.update(mealPlanId, data);
  }

  return { data: [], total: 0, message: 'Usuários pacientes não podem atualizar planos alimentares.' };
};

export const MealPlanService = {
  ...generateCrudService(MealPlanRepository),
  update, 
  getMealPlanByPatient,
  getActiveMealPlanForPatient
}


