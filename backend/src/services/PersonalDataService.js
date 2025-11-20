import { PatientRepository } from "../repositories/PatientRepository.js";
import { MealPlanRepository } from "../repositories/MealPlanRepository.js";
import { MealPlanDietaryRestrictionRepository } from "../repositories/MealPlanDietaryRestrictionRepository.js";
import { GoalRepository } from "../repositories/GoalRepository.js";
import { GoalObjectiveRepository } from "../repositories/GoalObjectiveRepository.js";
import { HealthDataRepository } from "../repositories/HealthDataRepository.js";
import { MealPlanMealRepository } from "../repositories/MealPlanMealRepository.js";
import { MealPlanRecipeRepository } from "../repositories/MealPlanRecipeRepository.js";
import { RecipeRepository } from "../repositories/RecipeRepository.js";
import { GeminiService } from "./GeminiService.js";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../exceptions/AppError.js";

const prisma = new PrismaClient();

//Pega dados pessoais do paciente
const getPersonalData = async (userId) => {
  const patient = await PatientRepository.findByUserId(userId);
  if (!patient) return null;

  const { birth_date, gender, height, weight, user } = patient;

  // Calcula idade
  const idade = birth_date
    ? Math.floor(
        (new Date() - new Date(birth_date)) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  // Buscar Goal ativo
  const goal = await GoalRepository.search({
    filters: [
      { field: "id_patient", value: patient.id },
      { field: "status", value: "ACTIVE" },
    ],
  });
  const activeGoal = goal.data?.[0];

  // Buscar objetivos do goal
  let objectives = [];
  if (activeGoal) {
    const goalObjectives = await GoalObjectiveRepository.search({
      filters: [{ field: "id_goal", value: activeGoal.id }],
    });
    objectives = goalObjectives.data?.map((go) => go.id_objective) || [];
  }

  // Buscar MealPlan ativo para restrições
  const mealPlan = await MealPlanRepository.search({
    filters: [
      { field: "id_patient", value: patient.id },
      { field: "status", value: "ACTIVE" },
    ],
  });
  const activeMealPlan = mealPlan.data?.[0];

  let restrictions = [];
  if (activeMealPlan) {
    const mealPlanRestrictions = await MealPlanDietaryRestrictionRepository.search({
      filters: [{ field: "id_meal_plan", value: activeMealPlan.id }],
    });
    restrictions = mealPlanRestrictions.data?.map((r) => r.id_dietary_restriction) || [];
  }

  return {
    nome: user?.name || "",
    email: user?.email || "",
    idade,
    birth_date, // Retornar data bruta
    gender, // Retornar enum bruto
    sexo:
      gender === "FEM"
        ? "Feminino"
        : gender === "MASC"
        ? "Masculino"
        : "Não informado",
    altura: height,
    peso: weight,
    target_weight: activeGoal?.target_weight || null,
    objectives, // Array de IDs
    restrictions, // Array de IDs
    preferences: [], // Não implementado ainda
  };
};

const updatePersonalData = async (userId, personalData) => {
  const {
    birth_date,
    gender,
    height,
    weight,
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
    // 1. Atualizar dados do Patient
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

    // 2. Buscar ou criar Goal ativo
    let goal;
    const existingGoals = await GoalRepository.search({
      filters: [
        { field: "id_patient", value: patient.id },
        { field: "status", value: "ACTIVE" },
      ],
    });

    if (existingGoals.data && existingGoals.data.length > 0) {
      goal = existingGoals.data[0];
    } else {
      // Criar novo goal se não existir
      const goalData = {
        id_patient: patient.id,
        description: "Objetivo inicial do paciente",
        start_date: new Date(),
        status: "ACTIVE",
        created_at: new Date(),
        updated_at: new Date(),
      };
      goal = await GoalRepository.create(goalData, tx);
    }

    // 3. Atualizar objetivos - remover existentes e criar novos
    if (objectives.length > 0) {
      // Remover objetivos existentes (soft delete)
      const existingObjectives = await GoalObjectiveRepository.search({
        filters: [{ field: "id_goal", value: goal.id }],
      });

      for (const obj of existingObjectives.data || []) {
        await GoalObjectiveRepository.remove(obj.id, tx);
      }

      // Criar novos objetivos
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

    // 4. Buscar ou criar MealPlan ativo
    let mealPlan;
    const existingMealPlans = await MealPlanRepository.search({
      filters: [
        { field: "id_patient", value: patient.id, operator: "equals" },
        { field: "status", value: "ACTIVE", operator: "equals" },
      ],
    });

    if (existingMealPlans.data && existingMealPlans.data.length > 0) {
      mealPlan = existingMealPlans.data[0];
    } else {
      // // Gerar 10 planos alimentares completos com IA
      // console.log('🚀 Nenhum plano existente. Gerando 10 planos com IA...');
      
      // // Buscar objetivos já carregados acima (passo 3)
      // const existingObjectives = await GoalObjectiveRepository.search({
      //   filters: [{ field: "id_goal", value: goal.id, operator: "equals" }],
      // });
      
      // const aiResult = await generateCompleteAIMealPlans(
      //   patient, 
      //   goal, 
      //   updatedPatientData, // Dados atualizados
      //   existingObjectives.data || [], // Objetivos já carregados
      //   [], // Restrições virão depois
      //   tx
      // );
      
      // if (aiResult.success && aiResult.plans.length > 0) {
      //   // Ativar o primeiro plano gerado
      //   mealPlan = await MealPlanRepository.update(
      //     aiResult.plans[0].id,
      //     { status: "ACTIVE" },
      //     tx
      //   );
        
      //   console.log(`✅ Plano 1 ativado. ${aiResult.count - 1} planos alternativos disponíveis.`);
      // } else {
      //   // Fallback: criar plano padrão se IA falhar
      //   console.warn('⚠️  IA falhou. Criando plano padrão...');
        
      //   const mealPlanData = {
      //     id_patient: patient.id,
      //     id_nutritionist: 1,
      //     id_goal: goal.id,
      //     calories: 2000,
      //     status: "ACTIVE",
      //     ai_generated: false,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   };
      //   mealPlan = await MealPlanRepository.create(mealPlanData, tx);
      // }
    }

    //5. Atualizar restrições - remover existentes e criar novas
    if (restrictions.length >= 0) {
      // Permitir array vazio para remover todas
      // Remover restrições existentes
      const existingRestrictions =
        await MealPlanDietaryRestrictionRepository.search({
          filters: [
            { field: "id_meal_plan", value: mealPlan.id, operator: "equals" },
          ],
        });

      for (const restriction of existingRestrictions.data || []) {
        await MealPlanDietaryRestrictionRepository.remove(restriction.id, tx);
      }

      // Criar novas restrições
      for (const restrictionId of restrictions) {
        const restrictionData = {
          id_meal_plan: mealPlan.id,
          id_dietary_restriction: restrictionId,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await MealPlanDietaryRestrictionRepository.create(restrictionData, tx);
      }
    }

    //6. Atualizar ou criar HealthData mais recente (dentro da transação)
    const latestHealthData = await HealthDataRepository.search({
      filters: [{ field: "id_patient", value: patient.id, operator: "equals" }],
      orderColumn: "record_date",
      order: "desc",
      limit: 1,
      tx
    });

    let latestHealth;
    if (latestHealthData.data && latestHealthData.data.length > 0) {
      // Se já existe, atualiza o mais recente
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
      // Se não existe, cria o primeiro registro
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
      mealPlan,
      restrictionsCount: restrictions.length,
      objectivesCount: objectives.length,
      preferencesCount: preferences.length,
    };
  });

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
