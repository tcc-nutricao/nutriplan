import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
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
    const { data: mealPlans = [] } = await getMealPlanByPatient(filters)
    
    if (mealPlans.length === 0) {
      return { data: null, message: 'Nenhum plano de refeição ativo encontrado' }
    }
    
    return mealPlans[0]
  } catch (error) {
    console.error('Erro ao buscar meal plan ativo:', error)
    throw error
  }
}

export const MealPlanService = {
  ...generateCrudService(MealPlanRepository),
  getMealPlanByPatient,
  getActiveMealPlanForPatient
}


