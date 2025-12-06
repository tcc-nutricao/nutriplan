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


const getMealPlanByPatient = async (patientId, additionalFilters = []) => {
  try {
    if (!patientId) {
      throw new AppError({ message: 'Paciente não encontrado para o patientId fornecido' })
    }

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

const getActiveMealPlanForPatient = async (patientId) => {
  try {
    if (!patientId) {
      throw new AppError({ message: 'ID do paciente é obrigatório' })
    }

    const filters = [
      { field: 'mealPlanPatients', value: { id_patient: patientId, status: 'ACTIVE' }, operator: 'some' }
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
  
  if (!mealPlan) throw new AppError('Plano alimentar não encontrado');

  const patientId = mealPlan.mealPlanPatients?.[0]?.id_patient;
  
  if (!patientId) throw new AppError('Paciente não encontrado para este plano alimentar');

  if (data.status === 'ACTIVE') {
    delete data.status; 
  }

  const patient = await PatientRepository.findById(patientId);
  const canEdit = user.role === 'PROFESSIONAL' || !patient.id_nutritionist;

  if (canEdit) {
    return await MealPlanRepository.update(mealPlanId, data);
  }

  return { data: [], total: 0, message: 'Usuários pacientes não podem atualizar planos alimentares.' };

};

const updateWithRelations = async (id, data, user) => {
  try {
     const mealPlanId = parseInt(id, 10);
     const mealPlan = await MealPlanRepository.findById(mealPlanId);

     if (!mealPlan) throw new AppError('Plano alimentar não encontrado');
     
     // Permission check: only PRO owners can full update
     // Permission check: only PRO owners can full update
     if (user.role !== 'PROFESSIONAL') {
         throw new AppError('Apenas nutricionistas podem editar planos.');
     }

     // Check if user is the nutritionist who created the plan
     // 1. Check by ID (if strictly equal)
     const nutritionistId = user.id_nutritionist || user.nutritionist?.id;
     
     // 2. Check by User ID relation (more robust if id_nutritionist is missing in session)
     // mealPlan.nutricionist should include 'user' based on repository default includes
     const planNutritionistUserId = mealPlan.nutricionist?.id_user;

     const isOwner = (nutritionistId && mealPlan.id_nutritionist === nutritionistId) || 
                     (planNutritionistUserId && user.id === planNutritionistUserId);

     if (!isOwner) {
        throw new AppError('Você não tem permissão para editar este plano');
     }

     return await prisma.$transaction(async (tx) => {
        const { 
          calories, 
          objective, 
          restrictions = [], 
          mealRecipes = {} 
        } = data;

        // 1. Update basic info
        await tx.mealPlan.update({
          where: { id: mealPlanId },
          data: {
             calories: parseInt(calories),
             id_objective: objective,
             updated_at: new Date()
          }
        });

        // 2. Delete existing relations
        await tx.mealPlanDietaryRestriction.deleteMany({ where: { id_meal_plan: mealPlanId } });
        // Delete meals (cascades to recipes typically, but if not, we must delete recipes first?)
        // Prisma relies on foreign keys. Let's delete recipes via meals first to be safe if cascade isn't set, 
        // OR just delete meals if schema supports cascade. 
        // Assuming cascade or manual cleanup. Let's do manual to be safe if schema ambiguous.
        // Find meals
        const meals = await tx.mealPlanMeal.findMany({ where: { id_meal_plan: mealPlanId }, select: { id: true } });
        const mealIds = meals.map(m => m.id);
        
        if (mealIds.length > 0) {
           await tx.mealPlanRecipe.deleteMany({ where: { id_meal_plan_meal: { in: mealIds } } });
        }
        await tx.mealPlanMeal.deleteMany({ where: { id_meal_plan: mealPlanId } });


        // 3. Re-create restrictions
        if (restrictions && restrictions.length > 0) {
          for (const restrictionId of restrictions) {
            await MealPlanDietaryRestrictionRepository.create({
              id_meal_plan: mealPlanId,
              id_dietary_restriction: restrictionId,
              created_at: new Date(),
              updated_at: new Date()
            }, tx);
          }
        }

        // 4. Re-create meals and recipes
        for (const mealIdStr in mealRecipes) {
          const mealId = parseInt(mealIdStr);
          const daysData = mealRecipes[mealIdStr];

          for (const day in daysData) {
             const recipes = daysData[day];
             
             if (recipes && recipes.length > 0) {
               const mealPlanMeal = await MealPlanMealRepository.create({
                 id_meal_plan: mealPlanId,
                 id_meal: mealId,
                 day: day,
                 time: new Date(), 
                 created_at: new Date(),
                 updated_at: new Date()
               }, tx);

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

        return await MealPlanRepository.findById(mealPlanId);
     });

  } catch (error) {
    console.error('Erro ao atualizar plano (full):', error);
    throw error;
  }
};

const create = async (data, user) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { 
        calories, 
        objective, 
        restrictions = [], 
        mealRecipes = {}, 
        id_patient 
      } = data;

      const mealPlan = await tx.mealPlan.create({
        data: {
          id_nutritionist: user.id_nutritionist || user.nutritionist?.id,
          id_objective: objective,
          calories: parseInt(calories),
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      if (id_patient) {
        await tx.mealPlanPatient.create({
           data: { id_meal_plan: mealPlan.id, id_patient, status: 'ACTIVE', created_at: new Date() }
        });
      }

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

      
      for (const mealIdStr in mealRecipes) {
        const mealId = parseInt(mealIdStr);
        const daysData = mealRecipes[mealIdStr];

        for (const day in daysData) {
           const recipes = daysData[day];
           
           if (recipes && recipes.length > 0) {
             const mealPlanMeal = await MealPlanMealRepository.create({
               id_meal_plan: mealPlan.id,
               id_meal: mealId,
               day: day,
               time: new Date(), 
               created_at: new Date(),
               updated_at: new Date()
             }, tx);

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

import { MealPlanPopulateService } from './MealPlanPopulateService.js'

const generateAutomaticPlan = async (patientId, nutritionistId) => {
  try {
    const patient = await PatientRepository.findById(patientId);
    if (!patient) throw new AppError('Paciente não encontrado');

    const goal = await GoalRepository.search({
      filters: [
        { field: "id_patient", value: patientId },
        { field: "status", value: "ACTIVE" },
      ],
    });
    const activeGoal = goal.data?.[0];
    
    if (!activeGoal) throw new AppError('Paciente não possui objetivo ativo');

    // Calcular Calorias (Mifflin-St Jeor)
    const age = new Date().getFullYear() - new Date(patient.birth_date).getFullYear();
    let tmb = 0;
    
    if (patient.gender === 'MASC') {
      tmb = (10 * patient.weight) + (6.25 * patient.height) - (5 * age) + 5;
    } else {
      tmb = (10 * patient.weight) + (6.25 * patient.height) - (5 * age) - 161;
    }
    
    let dailyCalories = tmb * 1.2;
    
    const goalObjectives = await GoalObjectiveRepository.search({
        filters: [{ field: "id_goal", value: activeGoal.id }],
    });
    const goalType = goalObjectives.data?.[0]?.objective?.name?.toLowerCase() || '';

    if (goalType.includes('perda') || goalType.includes('emagrecer') || goalType.includes('queima')) {
      dailyCalories -= 500; 
    } else if (goalType.includes('ganho') || goalType.includes('hipertrofia') || goalType.includes('massa')) {
      dailyCalories += 400; 
    }
    
    if (dailyCalories < 1200) dailyCalories = 1200;
    if (dailyCalories > 4000) dailyCalories = 4000;

    const activePlans = await getMealPlanByPatient(patientId, [
        { field: 'mealPlanPatients', value: { id_patient: patientId, status: 'ACTIVE' }, operator: 'some' }
    ]);

    if (activePlans.data && activePlans.data.length > 0) {
        for (const plan of activePlans.data) {
            const mpp = plan.mealPlanPatients.find(p => p.id_patient === patientId && p.status === 'ACTIVE');
            if (mpp) {
                await prisma.mealPlanPatient.update({
                    where: { id: mpp.id },
                    data: { status: 'DRAFT' }
                });
            }
        }
    } else {
         const activeMpps = await prisma.mealPlanPatient.findMany({
             where: { id_patient: patientId, status: 'ACTIVE' }
         });
         
         for (const mpp of activeMpps) {
             await prisma.mealPlanPatient.update({
                 where: { id: mpp.id },
                 data: { status: 'DRAFT' }
             });
         }
    }

    const newPlan = await MealPlanRepository.create({
      id_patient: patientId, 
      id_nutritionist: nutritionistId, 
      id_objective: activeGoal.goalObjectives?.[0]?.id_objective, 
      calories: Math.round(dailyCalories),
      created_at: new Date(),
      updated_at: new Date()
    });

    const patientRestrictions = await PatientRepository.findById(patientId).then(p => p.patientDietaryRestrictions || []);
    if (patientRestrictions.length > 0) {
      for (const pr of patientRestrictions) {
        await MealPlanDietaryRestrictionRepository.create({
          id_meal_plan: newPlan.id,
          id_dietary_restriction: pr.id_dietary_restriction,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await MealPlanPopulateService.populateMealPlan(newPlan.id);
    return newPlan;

  } catch (error) {
    console.error('Erro ao gerar plano automático:', error);
    throw error;
  }
};

const assignPlanToPatient = async (mealPlanId, patientId) => {
    try {
        const mealPlan = await MealPlanRepository.findById(mealPlanId);
        if (!mealPlan) throw new AppError('Plano alimentar não encontrado');

        const activePlans = await getMealPlanByPatient(patientId, [
            { field: 'mealPlanPatients', value: { id_patient: patientId, status: 'ACTIVE' }, operator: 'some' }
        ]);

        if (activePlans.data && activePlans.data.length > 0) {
            for (const plan of activePlans.data) {
                if (plan.id !== mealPlanId) {
                     const mpp = plan.mealPlanPatients.find(p => p.id_patient === patientId && p.status === 'ACTIVE');
                     if (mpp) {
                        await prisma.mealPlanPatient.update({
                            where: { id: mpp.id },
                            data: { status: 'DRAFT' }
                        });
                     }
                }
            }
        }

        const existingMpp = await prisma.mealPlanPatient.findFirst({
            where: { id_meal_plan: mealPlanId, id_patient: patientId }
        });
        
        if (existingMpp) {
            await prisma.mealPlanPatient.update({
                where: { id: existingMpp.id },
                data: { status: 'ACTIVE' }
            });
        } else {
             await prisma.mealPlanPatient.create({
                data: {
                    id_meal_plan: mealPlanId,
                    id_patient: patientId,
                    status: 'ACTIVE',
                    created_at: new Date()
                }
            });
        }

        return { message: 'Plano atribuído com sucesso' };

    } catch (error) {
        console.error('Erro ao atribuir plano:', error);
        throw error;
    }
}

export const MealPlanService = {
  ...generateCrudService(MealPlanRepository),
  create,
  update, 
  updateWithRelations,
  getMealPlanByPatient,
  getActiveMealPlanForPatient,
  generateAutomaticPlan,
  assignPlanToPatient
}
