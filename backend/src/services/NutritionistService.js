import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { NutritionistPatientRepository } from '../repositories/NutritionistPatientRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { generateCrudService } from './Service.js'
import { calculateImc, classifyImc } from '../utils/useImc.js'

const baseCrudService = generateCrudService(NutritionistRepository)

export const NutritionistService = {
  ...baseCrudService,

  async getPatients(userId) {
    try {
      if (!userId) {
        return { data: [], total: 0, message: 'userId é obrigatório' }
      }

      const nutritionist = await NutritionistRepository.findByUserId(userId)
      if (!nutritionist) {
        return { data: [], total: 0, message: 'Nutricionista não encontrado' }
      }

      const relations = await NutritionistPatientRepository.findByNutritionistId(nutritionist.id)
      if (relations.length === 0) {
        return { data: [], total: 0, message: 'Nenhum paciente encontrado' }
      }

      const result = []
      for (const relation of relations) {
        const patient = relation.patient || {}
        const user = patient.user || {}

        const activeMealPlan = await MealPlanService.getActiveMealPlanForPatient(patient.id)

        let objective = null
            if (activeMealPlan) {
                const mainObjective = activeMealPlan?.goal?.goalObjectives?.find(o => o.type === 'MAIN') || null
                    objective = mainObjective?.objective?.name
                        ?? mainObjective?.objective?.description
                        ?? null
            }

        const weight = patient.weight ?? 0
        const height = patient.height ?? 0

        const imc = calculateImc(weight, height)
        const imcDefinition = classifyImc(imc)

        result.push({
            name: user.name || 'Paciente desconhecido',
            objective,
            imc,
            imcDefinition,
            lastUpdated: patient.updated_at ?? patient.created_at
        })
      }

      return result
    } catch (error) {
      console.error('Erro geral ao buscar pacientes do nutricionista:', error)
      return { data: [], total: 0, message: 'Erro ao buscar pacientes' }
    }
  }
}
