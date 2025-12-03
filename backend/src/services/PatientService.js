import { PrismaClient } from '@prisma/client'
import { AppError } from '../exceptions/AppError.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { GoalRepository } from '../repositories/GoalRepository.js'
import { getImcData } from '../utils/useImc.js'
import { calculateProgress, calculateTotalDays } from '../utils/useProgress.js'
import { generateCrudService } from './Service.js'

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

const getAllByNutritionist = async (nutritionistId) => {
  try {
    const patients = await PatientRepository.findByNutritionistId(nutritionistId);

    return patients.map(patient => {
      const birthDate = new Date(patient.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }

      const latestHealthData = patient.healthData && patient.healthData.length > 0 ? patient.healthData[0] : null;
      const weight = latestHealthData ? latestHealthData.weight : patient.weight;
      const height = latestHealthData ? latestHealthData.height : patient.height;

      let objective = 'Não definido';
      let restrictions = [];
      let restrictionIds = [];
      let objectiveIds = [];
      let targetWeight = null;
      
      if (patient.patientDietaryRestrictions) {
          restrictions = patient.patientDietaryRestrictions.map(pdr => pdr.dietaryRestriction.name);
          restrictionIds = patient.patientDietaryRestrictions.map(pdr => pdr.dietaryRestriction.id);
      }

      const activeMealPlanPatient = patient.mealPlanPatients && patient.mealPlanPatients.length > 0 ? patient.mealPlanPatients[0] : null;
      const activeMealPlan = activeMealPlanPatient ? activeMealPlanPatient.mealPlan : null;

      let goal = patient.goals && patient.goals.length > 0 ? patient.goals[0] : null;
      
      if (goal) {
          targetWeight = goal.target_weight;
          if (goal.goalObjectives && goal.goalObjectives.length > 0) {
               const mainObjective = goal.goalObjectives.find(go => go.type === 'MAIN') || goal.goalObjectives[0];
               if (mainObjective && mainObjective.objective) {
                   objective = mainObjective.objective.name;
               }
               objectiveIds = goal.goalObjectives.map(go => go.objective.id);
          }
      }
      const lastUpdateDate = patient.updated_at || patient.created_at;
      const lastUpdate = new Date(lastUpdateDate).toLocaleDateString('pt-BR');

      return {
          id: patient.id,
          id_user: patient.id_user,
          name: patient.user.name,
          role: patient.user.role,
          email: patient.user.email,
          objective: objective,
          lastUpdate: lastUpdate,
          age: age.toString(),
          gender: patient.gender,
          height: height, 
          weight: weight,
          restrictions: restrictions,
          preferences: [], 
          mealPlan: activeMealPlan ? {
              calories: activeMealPlan.calories,
              dietaryRestrictions: activeMealPlan.mealPlanDietaryRestrictions.map(mpdr => mpdr.dietaryRestriction.icon || mpdr.dietaryRestriction.name),
              goalObjectives: goal ? goal.goalObjectives.map(go => ({ objective: { icon: go.objective.icon, name: go.objective.name } })) : []
          } : null,
          birth_date: patient.birth_date,
          target_weight: targetWeight,
          restrictionIds: restrictionIds,
          objectiveIds: objectiveIds,
          progress: patient.healthData ? patient.healthData.map(h => ({
              id: h.id,
              weight: h.weight,
              date: h.record_date
          })).reverse() : []
      };
    });
  } catch (error) {
    console.error('Erro ao buscar pacientes do nutricionista:', error);
    throw error;
  }
}

const deleteOrUnlink = async (patientId, nutritionistId) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: parseInt(patientId) },
            include: { user: true }
        });

        if (!patient) {
            throw new Error('Paciente não encontrado');
        }

        if (patient.user.role === 'GUEST') {
            await prisma.$transaction(async (tx) => {
                const goals = await tx.goal.findMany({ 
                    where: { id_patient: patient.id },
                    select: { id: true }
                });
                const goalIds = goals.map(g => g.id);

                if (goalIds.length > 0) {
                    await tx.goalObjective.deleteMany({ 
                        where: { id_goal: { in: goalIds } } 
                    });

                    const mealPlans = await tx.mealPlan.findMany({ 
                        where: { id_goal: { in: goalIds } },
                        select: { id: true }
                    });
                    const mealPlanIds = mealPlans.map(mp => mp.id);

                    if (mealPlanIds.length > 0) {
                        
                        await tx.mealPlanPatient.deleteMany({ 
                            where: { id_meal_plan: { in: mealPlanIds } } 
                        });

                        await tx.mealPlanDietaryRestriction.deleteMany({ 
                            where: { id_meal_plan: { in: mealPlanIds } } 
                        });

                        const mealPlanMeals = await tx.mealPlanMeal.findMany({ 
                            where: { id_meal_plan: { in: mealPlanIds } },
                            select: { id: true }
                        });
                        const mealPlanMealIds = mealPlanMeals.map(mpm => mpm.id);

                        if (mealPlanMealIds.length > 0) {
                            await tx.mealPlanRecipe.deleteMany({ 
                                where: { id_meal_plan_meal: { in: mealPlanMealIds } } 
                            });
                            
                            await tx.foodConsumed.deleteMany({ 
                                where: { id_meal_plan_meal: { in: mealPlanMealIds } } 
                            });

                            await tx.mealPlanMeal.deleteMany({ 
                                where: { id: { in: mealPlanMealIds } } 
                            });
                        }

                        await tx.mealPlan.deleteMany({ 
                            where: { id: { in: mealPlanIds } } 
                        });
                    }

                    await tx.goal.deleteMany({ 
                        where: { id: { in: goalIds } } 
                    });
                }

                await tx.healthData.deleteMany({ where: { id_patient: patient.id } });
                await tx.patientDietaryRestriction.deleteMany({ where: { id_patient: patient.id } });
                await tx.nutritionistPatient.deleteMany({ where: { id_patient: patient.id } });
                
                await tx.mealPlanPatient.deleteMany({ where: { id_patient: patient.id } });
                
                await tx.patient.delete({ where: { id: patient.id } });
                
                await tx.user.delete({ where: { id: patient.user.id } });
            });
            return { message: 'Paciente e usuário excluídos com sucesso' };
        } else {
            await prisma.$transaction(async (tx) => {
                await tx.nutritionistPatient.deleteMany({
                    where: {
                        id_patient: patient.id,
                        id_nutritionist: parseInt(nutritionistId)
                    }
                });
                
                if (patient.id_nutritionist === parseInt(nutritionistId)) {
                    await tx.patient.update({
                        where: { id: patient.id },
                        data: { id_nutritionist: null }
                    });
                }
            });
            return { message: 'Paciente desvinculado com sucesso' };
        }
    } catch (error) {
        console.error('Erro ao excluir/desvincular paciente:', error);
        throw error;
    }
}

const searchByTerm = async (searchTerm, nutritionistId, limit = 10) => {
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
      console.error('Erro ao buscar pacientes por termo:', error)
      throw error
    }
}

const createFullPatient = async (nutritionistId, patientData) => {
    try {
      console.log('createFullPatient - Start');
      console.log('nutritionistId:', nutritionistId);
      console.log('patientData:', JSON.stringify(patientData, null, 2));

      return prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: patientData.name,
            email: patientData.email || null,
            password: patientData.password || "mudar123",
            role: "GUEST",
            created_at: new Date(),
          }
        });

        const newPatient = await tx.patient.create({
          data: {
            id_user: newUser.id,
            id_nutritionist: nutritionistId,
            birth_date: new Date(patientData.birth_date),
            gender: patientData.gender,
            height: parseFloat(patientData.height),
            weight: parseFloat(patientData.weight),
            created_at: new Date(),
          }
        });

        await tx.healthData.create({
          data: {
            id_patient: newPatient.id,
            height: parseFloat(patientData.height),
            weight: parseFloat(patientData.weight),
            bmi: getImcData(parseFloat(patientData.weight), parseFloat(patientData.height) / 100).imc,
            record_date: new Date(),
            created_at: new Date(),
          }
        });

        if (patientData.objectives && patientData.objectives.length > 0) {
            const newGoal = await tx.goal.create({
                data: {
                    id_patient: newPatient.id,
                    description: "Objetivo inicial do paciente",
                    target_weight: patientData.target_weight ? parseFloat(patientData.target_weight) : null,
                    start_date: new Date(),
                    status: 'ACTIVE',
                    created_at: new Date()
                }
            });

            for (const objectiveId of patientData.objectives) {
                const type = patientData.objectives.indexOf(objectiveId) === 0 ? 'MAIN' : 'SECONDARY';
                
                await tx.goalObjective.create({
                    data: {
                        id_goal: newGoal.id,
                        id_objective: objectiveId,
                        type: type,
                        created_at: new Date()
                    }
                });
            }
        }

        if (patientData.restrictions && patientData.restrictions.length > 0) {
            for (const restrictionId of patientData.restrictions) {
                 await tx.patientDietaryRestriction.create({
                    data: {
                        id_patient: newPatient.id,
                        id_dietary_restriction: restrictionId,
                        created_at: new Date()
                    }
                 });
            }
        }

        await tx.nutritionistPatient.create({
            data: {
                id_nutritionist: nutritionistId,
                id_patient: newPatient.id,
                created_at: new Date()
            }
        });

        return newPatient;
      });
    } catch (error) {
      console.error('Erro no createFullPatient:', error);
      throw error;
    }
}

const updatePatient = async (id, data) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const patient = await tx.patient.findUnique({
          where: { id: parseInt(id) },
          include: { user: true }
        });

        if (!patient) {
          throw new AppError({ message: 'Paciente não encontrado' });
        }

        if (data.name || data.email) {
          await tx.user.update({
            where: { id: patient.id_user },
            data: {
              name: data.name,
              email: data.email
            }
          });
        }

        const patientUpdateData = {};
        if (data.birth_date) patientUpdateData.birth_date = new Date(data.birth_date);
        if (data.gender) patientUpdateData.gender = data.gender;
        if (data.height) patientUpdateData.height = parseFloat(data.height);
        if (data.weight) patientUpdateData.weight = parseFloat(data.weight);

        if (Object.keys(patientUpdateData).length > 0) {
          await tx.patient.update({
            where: { id: parseInt(id) },
            data: patientUpdateData
          });
        }

        if (data.weight || data.height) {
             await tx.healthData.create({
                data: {
                    id_patient: parseInt(id),
                    height: data.height ? parseFloat(data.height) : patient.height,
                    weight: data.weight ? parseFloat(data.weight) : patient.weight,
                    bmi: getImcData(
                        data.weight ? parseFloat(data.weight) : patient.weight, 
                        (data.height ? parseFloat(data.height) : patient.height) / 100
                    ).imc,
                    record_date: new Date(),
                    created_at: new Date(),
                }
             });
        }

        let goal = await tx.goal.findFirst({
            where: { id_patient: parseInt(id), status: 'ACTIVE' }
        });

        if (!goal && (data.target_weight || (data.objectives && data.objectives.length > 0))) {
             goal = await tx.goal.create({
                data: {
                    id_patient: parseInt(id),
                    description: "Objetivo atualizado",
                    target_weight: data.target_weight ? parseFloat(data.target_weight) : null,
                    start_date: new Date(),
                    status: 'ACTIVE',
                    created_at: new Date()
                }
            });
        } else if (goal && data.target_weight) {
            await tx.goal.update({
                where: { id: goal.id },
                data: { target_weight: parseFloat(data.target_weight) }
            });
        }

        if (goal && data.objectives) {
            await tx.goalObjective.deleteMany({ where: { id_goal: goal.id } });
            
            for (const objectiveId of data.objectives) {
                const type = data.objectives.indexOf(objectiveId) === 0 ? 'MAIN' : 'SECONDARY';
                await tx.goalObjective.create({
                    data: {
                        id_goal: goal.id,
                        id_objective: objectiveId,
                        type: type,
                        created_at: new Date()
                    }
                });
            }
        }

        if (data.restrictions) {
            await tx.patientDietaryRestriction.deleteMany({ where: { id_patient: parseInt(id) } });
            for (const restrictionId of data.restrictions) {
                 await tx.patientDietaryRestriction.create({
                    data: {
                        id_patient: parseInt(id),
                        id_dietary_restriction: restrictionId,
                        created_at: new Date()
                    }
                 });
            }
        }

        return patient;
      });
    } catch (error) {
      console.error('Erro no updatePatient:', error);
      throw error;
    }
}

const unlinkNutritionist = async (userId) => {
    try {
        const patient = await getPatientByUserId(userId);
        if (!patient) {
            throw new AppError({ message: 'Paciente não encontrado' });
        }

        if (!patient.id_nutritionist) {
            throw new AppError({ message: 'Você não possui um nutricionista vinculado' });
        }

        await prisma.$transaction(async (tx) => {
             await tx.nutritionistPatient.deleteMany({
                where: {
                    id_patient: patient.id,
                    id_nutritionist: patient.id_nutritionist
                }
            });

            await tx.patient.update({
                where: { id: patient.id },
                data: { id_nutritionist: null }
            });
        });

        return { message: 'Desvinculado com sucesso' };
    } catch (error) {
        console.error('Erro ao desvincular nutricionista:', error);
        throw error;
    }
}

export const PatientService = {
  ...baseCrudService,
  getPatientByUserId,
  getProgress,
  getAllByNutritionist,
  searchByTerm,
  createFullPatient,
  updatePatient,
  deleteOrUnlink,
  unlinkNutritionist
}