import { PatientRepository } from '../repositories/PatientRepository.js'
import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { MealPlanDietaryRestrictionRepository } from '../repositories/MealPlanDietaryRestrictionRepository.js'
import { GoalRepository } from '../repositories/GoalRepository.js'
import { GoalObjectiveRepository } from '../repositories/GoalObjectiveRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const updatePersonalData = async (userId, personalData) => {

    // nao esquecer de implementar a logica de preferences n * n
  const { birth_date, gender, height, weight, restrictions = [], objectives = [], preferences = [] } = personalData

  const existingPatient = await PatientRepository.search({
    filters: [{ field: 'id_user', value: userId, operator: 'equals' }]
  })

  if (!existingPatient.data || existingPatient.data.length === 0) {
    throw new Error('Dados pessoais do paciente não encontrados')
  }

  const patient = existingPatient.data[0]

  const result = await prisma.$transaction(async (tx) => {
    
    // 1. Atualizar dados do Patient
    const updatedPatientData = {
      birth_date: new Date(birth_date),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      updated_at: new Date()
    }

    const updatedPatient = await PatientRepository.update(patient.id, updatedPatientData, tx)

    // 2. Buscar ou criar Goal ativo
    let goal
    const existingGoals = await GoalRepository.search({
      filters: [
        { field: 'id_patient', value: patient.id, operator: 'equals' },
        { field: 'status', value: 'ACTIVE', operator: 'equals' }
      ]
    })

    if (existingGoals.data && existingGoals.data.length > 0) {
      goal = existingGoals.data[0]
    } else {
      // Criar novo goal se não existir
      const goalData = {
        id_patient: patient.id,
        description: 'Objetivo inicial do paciente',
        start_date: new Date(),
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }
      goal = await GoalRepository.create(goalData, tx)
    }

    // 3. Atualizar objetivos - remover existentes e criar novos
    if (objectives.length > 0) {
      // Remover objetivos existentes (soft delete)
      const existingObjectives = await GoalObjectiveRepository.search({
        filters: [{ field: 'id_goal', value: goal.id, operator: 'equals' }]
      })
      
      for (const obj of existingObjectives.data || []) {
        await GoalObjectiveRepository.remove(obj.id, tx)
      }

      // Criar novos objetivos
      for (let i = 0; i < objectives.length; i++) {
        const goalObjectiveData = {
          id_goal: goal.id,
          id_objective: objectives[i],
          type: i === 0 ? 'MAIN' : 'SECONDARY',
          created_at: new Date(),
          updated_at: new Date()
        }
        await GoalObjectiveRepository.create(goalObjectiveData, tx)
      }
    }

    // 4. Buscar ou criar MealPlan ativo
    let mealPlan
    const existingMealPlans = await MealPlanRepository.search({
      filters: [
        { field: 'id_patient', value: patient.id, operator: 'equals' },
        { field: 'status', value: 'ACTIVE', operator: 'equals' }
      ]
    })

    if (existingMealPlans.data && existingMealPlans.data.length > 0) {
      mealPlan = existingMealPlans.data[0]
    } else {
      // Criar novo meal plan se não existir
      const mealPlanData = {
        id_patient: patient.id,
        id_nutritionist: 1,
        id_goal: goal.id,
        calories: 2000,
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }
      mealPlan = await MealPlanRepository.create(mealPlanData, tx)
    }

    // 5. Atualizar restrições - remover existentes e criar novas
    if (restrictions.length >= 0) { // Permitir array vazio para remover todas
      // Remover restrições existentes
      const existingRestrictions = await MealPlanDietaryRestrictionRepository.search({
        filters: [{ field: 'id_meal_plan', value: mealPlan.id, operator: 'equals' }]
      })
      
      for (const restriction of existingRestrictions.data || []) {
        await MealPlanDietaryRestrictionRepository.remove(restriction.id, tx)
      }

      // Criar novas restrições
      for (const restrictionId of restrictions) {
        const restrictionData = {
          id_meal_plan: mealPlan.id,
          id_dietary_restriction: restrictionId,
          created_at: new Date(),
          updated_at: new Date()
        }
        await MealPlanDietaryRestrictionRepository.create(restrictionData, tx)
      }
    }

    // 6. Atualizar HealthData mais recente
    const latestHealthData = await HealthDataRepository.search({
      filters: [{ field: 'id_patient', value: patient.id, operator: 'equals' }],
      orderColumn: 'record_date',
      order: 'desc',
      limit: 1
    })

    if (latestHealthData.data && latestHealthData.data.length > 0) {
      const healthDataInfo = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2),
        record_date: new Date(),
        updated_at: new Date()
      }
      await HealthDataRepository.update(latestHealthData.data[0].id, healthDataInfo, tx)
    } else {
      // Criar novo se não existir
      const healthDataInfo = {
        id_patient: patient.id,
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2),
        record_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
      await HealthDataRepository.create(healthDataInfo, tx)
    }

    return {
      patient: updatedPatient,
      goal,
      mealPlan,
      restrictionsCount: restrictions.length,
      objectivesCount: objectives.length,
      preferencesCount: preferences.length
    }
  })

  return result
}

export const PersonalDataService = {
  updatePersonalData
}