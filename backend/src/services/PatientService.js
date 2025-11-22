import { PatientRepository } from '../repositories/PatientRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { generateCrudService } from './Service.js'
import { getImcData } from '../utils/useImc.js'
import { calculateProgress, formatProgressResponse, calculateTotalDays } from '../utils/useProgress.js'
import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const baseCrudService = generateCrudService(PatientRepository)

// Função para buscar paciente pelo ID do usuário
const getPatientByUserId = async (userId) => {
  try {
    const filters = [{ column: 'id_user', value: userId, operator: '=' }]
    const { data: patients = [] } = await PatientRepository.search({ filters })
    
    if (patients.length === 0) {
      throw new AppError({ message: 'Paciente não encontrado para este usuário' })
    }
    
    return patients[0]
  } catch (error) {
    console.error('Erro ao buscar paciente por user ID:', error)
    throw error
  }
}

const getProgress = async (userId) => {
  try {
    if (!userId) {
      throw new AppError({ message: 'userId é obrigatório' })
    }

    const patient = await PatientRepository.findByUserId(userId)
    if (!patient) {
      throw new AppError({ message: 'Paciente não encontrado' })
    }

    const mealPlanFilters = [{ column: 'status', value: 'ACTIVE', operator: 'equals' }]
    const { data: mealPlans = [] } = await MealPlanService.getMealPlanByPatient(userId, mealPlanFilters)

    if (mealPlans.length === 0) {
      return {
        metaAchieved: 0,
        progressHistory: [],
        message: 'Nenhum plano de refeição ativo encontrado'
      }
    }

    const activeMealPlan = mealPlans[0]
    const goal = activeMealPlan.goal
    const goalObjectives = goal?.goalObjectives || []

    // Buscar histórico de dados de saúde
    const healthDataFilters = [
      { field: 'id_patient', value: patient.id, operator: 'equals' }
    ]

    const { data: healthData = [] } = await HealthDataRepository.search({
      filters: healthDataFilters,
      order: 'desc',
      orderColumn: 'record_date'
    })

    // 👉 SE NÃO TIVER HEALTH DATA, RETORNA PROGRESSO 0
    if (!healthData || healthData.length === 0) {
      return {
        metaAchieved: 0,
        progressHistory: [],
        message: 'Nenhum dado de saúde cadastrado ainda'
      }
    }

    // Aqui só chega se houver healthData
    const mainGoalObjective = goalObjectives.find(obj => obj.type === 'MAIN')
    const objective = mainGoalObjective?.objective

    const initialWeight = healthData[healthData.length - 1].weight
    const actualWeight = healthData[0].weight
    const height = patient.height / 100
    const lastUpdate = healthData[0].record_date

    const progress = healthData.map(h => ({
      weight: h.weight,
      date: h.record_date
    })).reverse()

    const { imc } = getImcData(actualWeight, height)

    const progressData = calculateProgress(
      objective.id,
      { weight: initialWeight, height, date: healthData[healthData.length - 1].record_date },
      { weight: actualWeight, height, date: lastUpdate },
      {
        targetWeight: goal?.target_weight,
        totalDays: calculateTotalDays(goal?.start_date, goal?.end_date),
        daysFollowed: progress.length
      },
      objective.name
    )

    const patientData = {
      idPatient: patient.id,
      height: patient.height,
      initialWeight,
      actualWeight,
      currentImc: imc,
      lastUpdate,
      weightHistory: progress
    }

    return formatProgressResponse(progressData, patientData)

  } catch (err) {
    console.log('Erro no getProgress:', err)
    throw err
  }
}


export const PatientService = {
  ...baseCrudService,
  getPatientByUserId,
  getProgress,

  async searchByTerm(searchTerm, nutritionistId, limit = 10) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return { data: [], total: 0 }
      }

      if (!nutritionistId) {
        throw new Error('ID do nutricionista é obrigatório')
      }

      const where = {
        deleted_at: null,
        id_nutritionist: nutritionistId,
        user: {
          name: {
            contains: searchTerm.trim()
          }
        }
      }

      const [data, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            user: {
              name: 'asc'
            }
          }
        }),
        prisma.patient.count({ where })
      ])

      // Format response to include patient data with user info
      const formattedData = data.map(patient => ({
        id: patient.id,
        name: patient.user.name,
        email: patient.user.email,
        userId: patient.user.id
      }))

      return { data: formattedData, total }
    } catch (error) {
      console.error('Erro ao pesquisar pacientes:', error)
      throw error
    }
  }
}