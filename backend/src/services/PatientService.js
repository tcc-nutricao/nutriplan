import { PatientRepository } from '../repositories/PatientRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { GoalRepository } from '../repositories/GoalRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { generateCrudService } from './Service.js'
import { getImcData } from '../utils/useImc.js'
import { calculateProgress, formatProgressResponse, calculateTotalDays } from '../utils/useProgress.js'
import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const baseCrudService = generateCrudService(PatientRepository)

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

    const healthDataFilters = [
      { field: 'id_patient', value: patient.id, operator: 'equals' }
    ]

    const { data: healthData = [] } = await HealthDataRepository.search({
      filters: healthDataFilters,
      order: 'desc',
      orderColumn: 'record_date'
    })

    let actualWeight = patient.weight;
    let initialWeight = patient.weight;
    let height = patient.height / 100; 
    let lastUpdate = patient.updated_at || patient.created_at;
    let progressHistory = [];

    if (healthData && healthData.length > 0) {
        actualWeight = healthData[0].weight;
        initialWeight = healthData[healthData.length - 1].weight;
        lastUpdate = healthData[0].record_date;
        progressHistory = healthData.map(h => ({
            weight: h.weight,
            date: h.record_date
        })).reverse();
    }

    let imc = 0;
    try {
        if (actualWeight > 0 && height > 0) {
            const imcData = getImcData(actualWeight, height);
            imc = imcData.imc;
        }
    } catch (e) {
        imc = 0;
    }

    let targetWeight = null;
    let objectiveName = 'Não definido';
    let metaAchieved = 0;
    let weightDifference = 0;

    let goal = null;

    if (mealPlans.length > 0) {
        const activeMealPlan = mealPlans[0];
        goal = activeMealPlan.goal;
    }

    if (!goal) {
        try {
             const goalFilters = [
                { field: 'id_patient', value: patient.id, operator: 'equals' },
                { field: 'status', value: 'ACTIVE', operator: 'equals' }
            ];
            const { data: goals = [] } = await GoalRepository.search({
                filters: goalFilters,
                limit: 1,
                order: 'desc',
                orderColumn: 'created_at'
            });
            if (goals.length > 0) {
                goal = goals[0];
            }
        } catch (e) {
            console.warn('Erro ao buscar objetivo do paciente:', e.message);
        }
    }

    if (goal) {
        const goalObjectives = goal?.goalObjectives || [];
        const mainGoalObjective = goalObjectives.find(obj => obj.type === 'MAIN');
        const objective = mainGoalObjective?.objective;

        if (objective) {
            objectiveName = objective.name;
            targetWeight = goal?.target_weight;

             try {
                const progressData = calculateProgress(
                  objective.id,
                  { weight: initialWeight, height, date: healthData.length > 0 ? healthData[healthData.length - 1].record_date : patient.created_at },
                  { weight: actualWeight, height, date: lastUpdate },
                  {
                    targetWeight: goal?.target_weight,
                    totalDays: calculateTotalDays(goal?.start_date, goal?.end_date),
                    daysFollowed: progressHistory.length
                  },
                  objective.name
                )
                metaAchieved = progressData.metaAchieved;
                weightDifference = progressData.weightDifference;
            } catch (e) {
                console.warn('Erro ao calcular progresso:', e.message);
            }
        }
    }

    return {
        id_patient: patient.id,
        height: patient.height,
        objective: objectiveName,
        initialWeight: initialWeight,
        actualWeight: actualWeight,
        targetWeight: targetWeight,
        imc: imc,
        lastUpdate: lastUpdate,
        progress: progressHistory,
        metaAchieved: metaAchieved,
        weightDifference: weightDifference
    };

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