
import { PatientRepository } from '../repositories/PatientRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { generateCrudService } from './Service.js'
import { getImcData } from '../utils/useImc.js'
import { calculateProgress, formatProgressResponse, calculateTotalDays } from '../utils/useProgress.js'
import { PrismaClient } from '@prisma/client'

const baseCrudService = generateCrudService(PatientRepository)

const prisma = new PrismaClient()

const insert = async (data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const patient = await PatientRepository.create(data, tx)
      const healthData = {
        id_patient: patient.id,
        height: patient.height,
        weight: patient.weight,
        record_date: new Date(),
        bmi: getImcData(patient.weight, patient.height).imc
      }
      await HealthDataRepository.create(healthData, tx)
      return patient
    })
    return result
  } catch (error) {
    console.error('Erro ao inserir paciente:', error)
    throw error
  }
}

// Função para buscar paciente pelo ID do usuário
const getPatientByUserId = async (userId) => {
  try {
    const filters = [{ column: 'id_user', value: userId, operator: '=' }]
    const { data: patients = [] } = await PatientRepository.search({ filters })
    
    if (patients.length === 0) {
      throw new Error('Paciente não encontrado para este usuário')
    }
    
    return patients[0]
  } catch (error) {
    console.error('Erro ao buscar paciente por user ID:', error)
    throw error
  }
}

const getProgress = async (patientId) => {
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
          return { data: [], total: 0, message: 'Nenhum plano de refeição ativo encontrado' }
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

      const mainGoalObjective = goalObjectives.find(obj => obj.type === 'MAIN')

      // Extrair dados para cálculo
      const objective = mainGoalObjective?.objective
      const initialWeight = healthData[healthData.length - 1].weight
      const actualWeight = healthData[0].weight
      const height = patient.height / 100 // converter cm para metros se necessário
      const lastUpdate = healthData[0].record_date

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

export const PatientService = {
  ...baseCrudService,
  insert,
  getPatientByUserId,
  getProgress
}