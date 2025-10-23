import { PatientRepository } from '../repositories/PatientRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { generateCrudService } from './Service.js'
import { getImcData } from '../utils/useImc.js'
import { calculateProgress, formatProgressResponse, calculateTotalDays } from '../utils/useProgress.js'

const baseCrudService = generateCrudService(PatientRepository)

export const PatientService = {
  ...baseCrudService,

  async getProgress(patientId) {
    try {
        if (!patientId) {
            throw new Error('patientId é obrigatório')
        }

        const patient = await PatientRepository.findById(patientId)
        if (!patient) {
            throw new Error('Paciente não encontrado')
        }

        const mealPlanFilters = [{ column: 'status', value: 'ACTIVE', operator: '=' }]
        const { data: mealPlans = [] } = await MealPlanService.getMealPlanByPatient(patientId, mealPlanFilters)

        if (mealPlans.length === 0) {
            return { data: null, message: 'Nenhum plano de refeição ativo encontrado' }
        }

        const activeMealPlan = mealPlans[0]

        const goal = activeMealPlan.goal
        const goalObjectives = goal?.goalObjectives || []

        // Buscar histórico de dados de saúde
        const healthDataFilters = [
            { column: 'id_patient', value: patientId, operator: '=' }
        ]
        const { data: healthData = [] } = await HealthDataRepository.search({ 
            filters: healthDataFilters, 
            order: 'desc', 
            orderColumn: 'record_date' 
        })

        if (healthData.length === 0) {
            throw new Error('Nenhum dado de saúde encontrado')
        }

        // Extrair dados para cálculo
        const objective = goalObjectives[0].objective
        const initialWeight = healthData[healthData.length - 1].weight
        const actualWeight = healthData[0].weight
        const height = patient.height / 100 // converter cm para metros se necessário
        const lastUpdate = healthData[0].record_date

        console.log(healthData)
        
        // Preparar histórico de progresso
        const progress = healthData.map(health => ({
            weight: health.weight,
            date: health.record_date
        })).reverse() // do mais antigo para o mais recente

        // Calcular IMC atual
        const { imc } = getImcData(actualWeight, height)

        // Calcular progresso baseado no objetivo
        const progressData = calculateProgress(
            objective.id,
            { weight: initialWeight, height: height, date: healthData[healthData.length - 1].record_date },
            { weight: actualWeight, height: height, date: lastUpdate },
            { 
                targetWeight: goal?.target_weight, 
                totalDays: calculateTotalDays(goal?.start_date, goal?.end_date), 
                daysFollowed: progress.length 
            },
            objective.name
        )

        // Dados do paciente para formatação
        const patientData = {
            initialWeight,
            actualWeight,
            currentImc: imc,
            lastUpdate,
            weightHistory: progress
        }

        // Retornar resposta formatada
        return formatProgressResponse(progressData, patientData)

    } catch (err) {
        console.log('Erro no getProgress:', err)
        throw err
    }
  }
}