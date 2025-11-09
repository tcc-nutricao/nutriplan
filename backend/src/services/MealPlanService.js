import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'


// Métodos customizados adicionais
const getMealPlanByPatient = async (patientId, additionalFilters = []) => {
  try {
    if (!patientId) {
      throw new Error('patientId é obrigatório')
    }

    // Combinar filtro do paciente com filtros adicionais
    const filters = [
      { column: 'id_patient', value: patientId, operator: '=' },
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

// Função para buscar meal plan ativo do paciente
const getActiveMealPlanForPatient = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('ID do paciente é obrigatório')
    }

    const filters = [
      { column: 'status', value: 'ACTIVE', operator: '=' },
      { column: 'id_patient', value: patientId, operator: '=' }
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
  // Se o status está sendo alterado para ACTIVE
  const mealPlan = await MealPlanRepository.findById(mealPlanId);
  const patientId = mealPlan.id_patient;
  if (data.status === 'ACTIVE') {
    // Busca o meal plan atual para pegar o paciente
    if (!mealPlan) throw new Error('Plano alimentar não encontrado');
    // Desativa outros planos ativos desse paciente
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


