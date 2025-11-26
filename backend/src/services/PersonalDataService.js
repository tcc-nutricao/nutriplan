import { PatientRepository } from "../repositories/PatientRepository.js";
import { MealPlanRepository } from "../repositories/MealPlanRepository.js";
import { MealPlanDietaryRestrictionRepository } from "../repositories/MealPlanDietaryRestrictionRepository.js";
import { PatientDietaryRestrictionRepository } from "../repositories/PatientDietaryRestrictionRepository.js";
import { GoalRepository } from "../repositories/GoalRepository.js";
import { GoalObjectiveRepository } from "../repositories/GoalObjectiveRepository.js";
import { HealthDataRepository } from "../repositories/HealthDataRepository.js";
import { MealPlanMealRepository } from "../repositories/MealPlanMealRepository.js";
import { MealPlanRecipeRepository } from "../repositories/MealPlanRecipeRepository.js";
import { RecipeRepository } from "../repositories/RecipeRepository.js";
import { MealPlanPopulateService } from "./MealPlanPopulateService.js";
import { GeminiService } from "./GeminiService.js";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../exceptions/AppError.js";

const prisma = new PrismaClient();

const getPersonalData = async (userId) => {
  const patient = await PatientRepository.findByUserId(userId);
  if (!patient) return null;

  const { birth_date, gender, height, weight, user } = patient;

  const idade = birth_date
    ? Math.floor(
        (new Date() - new Date(birth_date)) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  const goal = await GoalRepository.search({
    filters: [
      { field: "id_patient", value: patient.id },
      { field: "status", value: "ACTIVE" },
    ],
  });
  const activeGoal = goal.data?.[0];

  let objectiveNames = [];
  if (activeGoal) {
    const goalObjectives = await GoalObjectiveRepository.search({
      filters: [{ field: "id_goal", value: activeGoal.id }],
    });
    
    objectiveNames = goalObjectives.data?.map((go) => go.objective?.name || "Desconhecido") || [];
  }

  let restrictionNames = [];
  const patientRestrictions = await PatientDietaryRestrictionRepository.search({
    filters: [{ field: "id_patient", value: patient.id }],
  });
  
  restrictionNames = patientRestrictions.data?.map((r) => r.dietaryRestriction?.name || "Desconhecido") || [];

  return {
    nome: user?.name || "",
    email: user?.email || "",
    idade,
    birth_date, 
    gender,
    sexo:
      gender === "FEM"
        ? "Feminino"
        : gender === "MASC"
        ? "Masculino"
        : "Não informado",
    altura: height,
    peso: weight,
    meta: activeGoal?.target_weight || null, 
    objetivo: objectiveNames.length > 0 ? objectiveNames.join(", ") : "Não informado", 
    restricoes: restrictionNames.length > 0 ? restrictionNames : ["Nenhuma"], 
    target_weight: activeGoal?.target_weight || null,
    objectives: activeGoal ? (await GoalObjectiveRepository.search({
      filters: [{ field: "id_goal", value: activeGoal.id }],
    })).data?.map((go) => go.id_objective) || [] : [],
    restrictions: patientRestrictions.data?.map((r) => r.id_dietary_restriction) || [],
  };
};

const updatePersonalData = async (userId, personalData) => {
  const {
    birth_date,
    gender,
    height,
    weight,
    target_weight,
    restrictions = [],
    objectives = [],
    preferences = [],
  } = personalData;

  const existingPatient = await PatientRepository.search({
    filters: [{ field: "id_user", value: userId }],
  });

  if (!existingPatient.data || existingPatient.data.length === 0) {
    throw new AppError({ message: "Dados pessoais do paciente não encontrados" });
  }

  const patient = existingPatient?.data?.[0];

  if (birth_date) {
    const birthDate = new Date(birth_date);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 5 || age > 150) {
      throw new AppError({ message: "A data de nascimento deve ser válida.", statusCode: 400, field: "birth_date" });
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPatientData = {
      birth_date: new Date(birth_date),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      updated_at: new Date(),
    };

    const updatedPatient = await PatientRepository.update(
      patient.id,
      updatedPatientData,
      tx
    );

    let goal;
    const existingGoals = await GoalRepository.search({
      filters: [
        { field: "id_patient", value: patient.id },
        { field: "status", value: "ACTIVE" },
      ],
    });

    if (existingGoals.data && existingGoals.data.length > 0) {
      goal = existingGoals.data[0];
      if (target_weight !== undefined) {
        goal = await GoalRepository.update(
          goal.id,
          { target_weight, updated_at: new Date() },
          tx
        );
      }
    } else {
      const goalData = {
        id_patient: patient.id,
        description: "Objetivo inicial do paciente",
        target_weight: target_weight || null,
        start_date: new Date(),
        status: "ACTIVE",
        created_at: new Date(),
        updated_at: new Date(),
      };
      goal = await GoalRepository.create(goalData, tx);
    }

    if (objectives.length > 0) {
      const existingObjectives = await GoalObjectiveRepository.search({
        filters: [{ field: "id_goal", value: goal.id }],
      });

      for (const obj of existingObjectives.data || []) {
        await GoalObjectiveRepository.remove(obj.id, tx);
      }

      for (let i = 0; i < objectives.length; i++) {
        const goalObjectiveData = {
          id_goal: goal.id,
          id_objective: objectives[i],
          type: i === 0 ? "MAIN" : "SECONDARY",
          created_at: new Date(),
          updated_at: new Date(),
        };
        await GoalObjectiveRepository.create(goalObjectiveData, tx);
      }
    }

    if (restrictions.length >= 0) {
      const existingRestrictions =
        await PatientDietaryRestrictionRepository.search({
          filters: [
            { field: "id_patient", value: patient.id, operator: "equals" },
          ],
        });

      for (const restriction of existingRestrictions.data || []) {
        await PatientDietaryRestrictionRepository.remove(restriction.id, tx);
      }

      for (const restrictionId of restrictions) {
        const restrictionData = {
          id_patient: patient.id,
          id_dietary_restriction: restrictionId,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await PatientDietaryRestrictionRepository.create(restrictionData, tx);
      }
    }

    const latestHealthData = await HealthDataRepository.search({
      filters: [{ field: "id_patient", value: patient.id, operator: "equals" }],
      orderColumn: "record_date",
      order: "desc",
      limit: 1,
      tx
    });

    let latestHealth;
    if (latestHealthData.data && latestHealthData.data.length > 0) {
      const healthDataInfo = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2),
        record_date: new Date(),
        updated_at: new Date(),
      };
      await HealthDataRepository.update(
        latestHealthData.data[0].id,
        healthDataInfo,
        tx
      );
      latestHealth = { ...latestHealthData.data[0], ...healthDataInfo };
    } else {
      if (height && weight) {
        const bmi = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
        const healthDataInfo = {
          id_patient: patient.id,
          height: parseFloat(height),
          weight: parseFloat(weight),
          bmi,
          record_date: new Date(),
        };
        const created = await HealthDataRepository.create(healthDataInfo, tx);
        latestHealth = created;
      }
    }

    // ta dando bug na req essa parte, ver depois o pq //

    // // Atualizar Patient com os dados mais recentes de HealthData
    // if (latestHealth) {
    //   const patientInfo = await PatientRepository.update(
    //     patient.id,
    //     {
    //       height: latestHealth.height,
    //       weight: latestHealth.weight
    //     },
    //     tx
    //   );
    // }

    return {
      patient: updatedPatient,
      goal,
      restrictionsCount: restrictions.length,
      objectivesCount: objectives.length,
      preferencesCount: preferences.length,
    };
  });

  try {
    const patientId = result.patient.id;
    
    const activePlan = await MealPlanRepository.search({
      filters: [
        { field: 'mealPlanPatients', value: { id_patient: patientId }, operator: 'some' },
        { field: 'status', value: 'ACTIVE' }
      ]
    });

    if (!activePlan.data || activePlan.data.length === 0) {
      console.log('✨ Gerando novo plano alimentar para o paciente...');
      
      // Calcular Calorias (Mifflin-St Jeor)
      const p = result.patient;
      const age = new Date().getFullYear() - new Date(p.birth_date).getFullYear();
      let tmb = 0;
      
      if (p.gender === 'MASC') {
        tmb = (10 * p.weight) + (6.25 * p.height) - (5 * age) + 5;
      } else {
        tmb = (10 * p.weight) + (6.25 * p.height) - (5 * age) - 161;
      }
      
      let dailyCalories = tmb * 1.2;
      
      const goalType = result.goal?.goalObjectives?.[0]?.objective?.name?.toLowerCase() || '';
      if (goalType.includes('perda') || goalType.includes('emagrecer') || goalType.includes('queima')) {
        dailyCalories -= 500; 
      } else if (goalType.includes('ganho') || goalType.includes('hipertrofia') || goalType.includes('massa')) {
        dailyCalories += 400; 
      }
      
      if (dailyCalories < 1200) dailyCalories = 1200;
      if (dailyCalories > 4000) dailyCalories = 4000;

      const newPlan = await MealPlanRepository.create({
        id_patient: patientId,
        id_nutritionist: p.id_nutritionist || 1, 
        id_goal: result.goal.id,
        calories: Math.round(dailyCalories),
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      });

      if (restrictions && restrictions.length > 0) {
        for (const restrictionId of restrictions) {
          await MealPlanDietaryRestrictionRepository.create({
            id_meal_plan: newPlan.id,
            id_dietary_restriction: restrictionId,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }

      await MealPlanPopulateService.populateMealPlan(newPlan.id);
      console.log(`✅ Plano ${newPlan.id} gerado e populado com sucesso.`);
    }
  } catch (error) {
    console.error('Erro ao gerar plano automático:', error);
  }

  return result;
};

/**
 * Gera e salva 10 planos alimentares completos com refeições e receitas usando IA
 * @param {Object} patient - Dados do paciente
 * @param {Object} goal - Goal ativo do paciente
 * @param {Object} patientData - Dados atualizados do paciente (height, weight, etc)
 * @param {Array} goalObjectives - Objetivos já carregados
 * @param {Array} dietaryRestrictions - Restrições alimentares já carregadas
 * @param {Object} tx - Transação Prisma (opcional)
 */
const generateCompleteAIMealPlans = async (
  patient, 
  goal, 
  patientData,
  goalObjectives = [],
  dietaryRestrictions = [],
  tx = null
) => {
  try {
    console.log('🤖 Iniciando geração de 10 planos completos com IA...');

    // 1. Calcular idade (usar dados já disponíveis)
    const age = patient.birth_date
      ? Math.floor((new Date() - new Date(patient.birth_date)) / (365.25 * 24 * 60 * 60 * 1000))
      : 25;

    // 2. Usar dados já atualizados do paciente (evita busca no banco)
    const latestHealth = {
      height: patientData.height || patient.height,
      weight: patientData.weight || patient.weight,
      bmi: (patientData.weight || patient.weight) / Math.pow((patientData.height || patient.height) / 100, 2),
    };

    // 3. Usar objetivos já passados (evita busca duplicada)
    const restrictions = dietaryRestrictions.map(r => r.name || r);

    // 4. Buscar receitas disponíveis (limitar a 50 para não sobrecarregar o prompt)
    const recipesData = await RecipeRepository.search({
      limit: 50,
      orderColumn: "created_at",
      order: "desc",
    });
    
    const availableRecipes = recipesData.data || [];

    // 5. Montar perfil do paciente (usando dados já carregados)
    const userProfile = {
      height: latestHealth.height,
      weight: latestHealth.weight,
      bmi: latestHealth.bmi,
      gender: patientData.gender || patient.gender,
      age,
      goals: goalObjectives.map(go => ({
        name: go.objective?.name || "Saúde",
      })),
      dietaryRestrictions: restrictions,
    };

    // 6. Chamar Gemini para gerar 10 planos completos
    console.log('📡 Chamando IA Gemini...');
    const aiResponse = await GeminiService.generateCompleteMealPlans(
      userProfile, 
      availableRecipes, 
      10
    );

    // 7. Salvar os 10 planos no banco
    const savedPlans = [];
    const now = new Date();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 mês

    for (let planIndex = 0; planIndex < aiResponse.plans.length; planIndex++) {
      const aiPlan = aiResponse.plans[planIndex];
      
      console.log(`📝 Salvando plano ${planIndex + 1}: ${aiPlan.name || 'Sem nome'}`);

      // Criar MealPlan
      const mealPlanData = {
        id_patient: patient.id,
        id_nutritionist: patient.id_nutritionist || 1,
        id_goal: goal.id,
        calories: aiPlan.calories || 2000,
        status: "DRAFT", // Todos como rascunho
        ai_generated: true,
        expiration_date: expirationDate,
        created_at: now,
        updated_at: now,
      };

      const createdMealPlan = tx
        ? await MealPlanRepository.create(mealPlanData, tx)
        : await MealPlanRepository.create(mealPlanData);

      // Criar MealPlanMeals e MealPlanRecipes para cada dia
      if (aiPlan.days && Array.isArray(aiPlan.days)) {
        for (const dayData of aiPlan.days) {
          if (dayData.meals && Array.isArray(dayData.meals)) {
            for (const mealData of dayData.meals) {
              // Criar MealPlanMeal
              const mealPlanMealData = {
                id_meal_plan: createdMealPlan.id,
                id_meal: mealData.id_meal,
                time: mealData.time ? new Date(`1970-01-01T${mealData.time}:00`) : null,
                day: dayData.day,
                created_at: now,
                updated_at: now,
              };

              const createdMealPlanMeal = tx
                ? await MealPlanMealRepository.create(mealPlanMealData, tx)
                : await MealPlanMealRepository.create(mealPlanMealData);

              // Criar MealPlanRecipes (associar receitas à refeição)
              if (mealData.recipe_ids && Array.isArray(mealData.recipe_ids)) {
                for (const recipeId of mealData.recipe_ids) {
                  // Verificar se a receita existe
                  const recipeExists = availableRecipes.find(r => r.id === recipeId);
                  
                  if (recipeExists || recipeId <= availableRecipes.length) {
                    const mealPlanRecipeData = {
                      id_recipe: recipeId,
                      id_meal_plan_meal: createdMealPlanMeal.id,
                      favorite: false,
                      created_at: now,
                      updated_at: now,
                    };

                    if (tx) {
                      await MealPlanRecipeRepository.create(mealPlanRecipeData, tx);
                    } else {
                      await MealPlanRecipeRepository.create(mealPlanRecipeData);
                    }
                  }
                }
              }
            }
          }
        }
      }

      savedPlans.push(createdMealPlan);
    }

    console.log(`✅ ${savedPlans.length} planos completos salvos com sucesso!`);

    return {
      success: true,
      plans: savedPlans,
      count: savedPlans.length,
    };

  } catch (error) {
    console.error('❌ Erro ao gerar planos completos com IA:', error);
    return {
      success: false,
      plans: [],
      count: 0,
      error: error.message,
    };
  }
};

export const PersonalDataService = {
  updatePersonalData,
  getPersonalData,
  generateCompleteAIMealPlans,
};
