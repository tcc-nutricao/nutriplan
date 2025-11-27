import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { GoalRepository } from '../repositories/GoalRepository.js'
import { GoalObjectiveRepository } from '../repositories/GoalObjectiveRepository.js'
import { MealPlanDietaryRestrictionRepository } from '../repositories/MealPlanDietaryRestrictionRepository.js'
import { MealPlanMealRepository } from '../repositories/MealPlanMealRepository.js'
import { MealPlanRecipeRepository } from '../repositories/MealPlanRecipeRepository.js'
import { generateCrudService } from './Service.js'
import { AppError } from '../exceptions/AppError.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


// Métodos customizados adicionais
const getMealPlanByPatient = async (patientId, additionalFilters = []) => {
  try {
    if (!patientId) {
      throw new AppError({ message: 'Paciente não encontrado para o patientId fornecido' })
    }

    // Combinar filtro do paciente com filtros adicionais
    // Usando relation filtering: mealPlanPatients: { some: { id_patient: patientId } }
    const filters = [
      { field: 'mealPlanPatients', value: { id_patient: patientId }, operator: 'some' },
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
      throw new AppError({ message: 'ID do paciente é obrigatório' })
    }

    const filters = [
      { field: 'status', value: 'ACTIVE', operator: 'equals' },
      { field: 'mealPlanPatients', value: { id_patient: patientId }, operator: 'some' }
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
  
  if (!mealPlan) throw new AppError('Plano alimentar não encontrado');

  // Obter patientId da relação (assumindo que o include default traz mealPlanPatients)
  const patientId = mealPlan.mealPlanPatients?.[0]?.id_patient;
  
  if (!patientId) throw new AppError('Paciente não encontrado para este plano alimentar');

  if (data.status === 'ACTIVE') {
    // Desativa outros planos ativos desse paciente
    
    const activePlans = await getMealPlanByPatient(patientId, [
        { field: 'status', value: 'ACTIVE', operator: 'equals' },
        { field: 'id', value: mealPlanId, operator: 'not' }
    ]);

    if (activePlans.data && activePlans.data.length > 0) {
        for (const plan of activePlans.data) {
            await MealPlanRepository.update(plan.id, { status: 'COMPLETED' });
        }
    }
  }

  const patient = await PatientRepository.findById(patientId);
  const canEdit = user.role === 'PROFESSIONAL' || !patient.id_nutritionist;

  if (canEdit) {
    return await MealPlanRepository.update(mealPlanId, data);
  }

  return { data: [], total: 0, message: 'Usuários pacientes não podem atualizar planos alimentares.' };
};

const create = async (data, user) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { 
        calories, 
        objective, // id_objective
        restrictions = [], // array of id_dietary_restriction
        mealRecipes = {}, // { mealId: { day: [recipes] } }
        id_patient 
      } = data;

      // 1. Create Goal
      const goal = await GoalRepository.create({
        id_patient: id_patient || null,
        description: 'Plano Alimentar Profissional',
        target_weight: null,
        start_date: new Date(),
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }, tx);

      // 2. Link Objective to Goal
      if (objective) {
        await GoalObjectiveRepository.create({
          id_goal: goal.id,
          id_objective: objective,
          type: 'MAIN',
          created_at: new Date(),
          updated_at: new Date()
        }, tx);
      }

      // 3. Create MealPlan
      // Using direct prisma call to handle transaction correctly and avoid complexity with repository override
      const mealPlan = await tx.mealPlan.create({
        data: {
          id_nutritionist: user.id_nutritionist || user.nutritionist?.id,
          id_goal: goal.id,
          calories: parseInt(calories),
          status: 'ACTIVE',
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      if (id_patient) {
        await tx.mealPlanPatient.create({
           data: { id_meal_plan: mealPlan.id, id_patient, created_at: new Date() }
        });
      }

      // 4. Create Dietary Restrictions
      if (restrictions && restrictions.length > 0) {
        for (const restrictionId of restrictions) {
          await MealPlanDietaryRestrictionRepository.create({
            id_meal_plan: mealPlan.id,
            id_dietary_restriction: restrictionId,
            created_at: new Date(),
            updated_at: new Date()
          }, tx);
        }
      }

      // 5. Create Meals and Recipes
      // mealRecipes structure: { mealId: { day: [recipes] } }
      // We need to iterate over meals and days
      
      for (const mealIdStr in mealRecipes) {
        const mealId = parseInt(mealIdStr);
        const daysData = mealRecipes[mealIdStr];

        for (const day in daysData) {
           const recipes = daysData[day];
           
           if (recipes && recipes.length > 0) {
             // Create MealPlanMeal
             const mealPlanMeal = await MealPlanMealRepository.create({
               id_meal_plan: mealPlan.id,
               id_meal: mealId,
               day: day,
               time: new Date(), // Placeholder time
               created_at: new Date(),
               updated_at: new Date()
             }, tx);

             // Create MealPlanRecipes
             for (const recipe of recipes) {
               await MealPlanRecipeRepository.create({
                 id_meal_plan_meal: mealPlanMeal.id,
                 id_recipe: recipe.id,
                 favorite: false,
                 created_at: new Date(),
                 updated_at: new Date()
               }, tx);
             }
           }
        }
      }

      return mealPlan;
    });
  } catch (error) {
    console.error('Erro ao criar plano alimentar:', error);
    throw error;
  }
};

export const MealPlanService = {
  ...generateCrudService(MealPlanRepository),
  create,
  update, 
  getMealPlanByPatient,
  getActiveMealPlanForPatient
}
