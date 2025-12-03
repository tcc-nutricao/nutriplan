import {
  PrismaClient,
  Role,
  GoalStatus,
  MealPlanStatus,
  ReportType,
  UserGroupRole,
  WeekDay,
} from "@prisma/client";
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Hash das senhas
  const hashedPassword = await bcrypt.hash("123456", 10);

  // USERS
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: Role.PROFESSIONAL,
      profile_picture: null,
    },
  });
  const patientUser = await prisma.user.upsert({
    where: { email: "patient@example.com" },
    update: {},
    create: {
      name: "Paciente",
      email: "patient@example.com",
      password: hashedPassword,
      role: Role.STANDARD,
      profile_picture: null,
    },
  });
  const nutritionistUser = await prisma.user.upsert({
    where: { email: "nutri@example.com" },
    update: {},
    create: {
      name: "Nutri",
      email: "nutri@example.com",
      password: hashedPassword,
      role: Role.PROFESSIONAL,
      profile_picture: null,
    },
  });

  // NUTRITIONIST
  const nutritionist = await prisma.nutritionist.upsert({
    where: { id_user: nutritionistUser.id },
    update: {},
    create: {
      id_user: nutritionistUser.id,
      professional_register: "CRN12345",
      created_at: new Date(),
    },
  });

  // PATIENT
  const patient = await prisma.patient.upsert({
    where: { id_user: patientUser.id },
    update: {},
    create: {
      id_user: patientUser.id,
      id_nutritionist: nutritionist.id,
      birth_date: new Date("1990-01-01"),
      gender: "FEM",
      height: 175,
      weight: 70,
      created_at: new Date(),
    },
  });

  // HEALTH DATA
  await prisma.healthData.createMany({
    data: [
      {
        id_patient: patient.id,
        height: 1.75,
        weight: 80,
        bmi: 80 / (1.75 * 1.75),
        record_date: new Date('2025-09-01'),
        created_at: new Date('2025-09-01'),
      },
      {
        id_patient: patient.id,
        height: 1.75,
        weight: 78.5,
        bmi: 78.5 / (1.75 * 1.75),
        record_date: new Date('2025-10-01'),
        created_at: new Date('2025-10-01'),
      },
      {
        id_patient: patient.id,
        height: 1.75,
        weight: 76.2,
        bmi: 76.2 / (1.75 * 1.75),
        record_date: new Date('2025-11-01'),
        created_at: new Date('2025-11-01'),
      },
      {
        id_patient: patient.id,
        height: 1.75,
        weight: 75.8,
        bmi: 75.8 / (1.75 * 1.75),
        record_date: new Date('2025-11-15'),
        created_at: new Date('2025-11-15'),
      },
    ],
    skipDuplicates: true,
  });

  // OBJECTIVES & GOALS
  const objectives = await prisma.objective.createMany({
    data: [
      {
        id: 1,
        name: "Perda de peso",
        icon: "fa-solid fa-fire text-ic-emagrecer",
        description: "Reduzir peso corporal de forma saudável",
        created_at: new Date(),
      },
      {
        id: 2,
        name: "Ganho de massa muscular",
        icon: "fa-solid fa-dumbbell text-ic-musculo",
        description: "Aumentar peso corporal de forma saudável",
        created_at: new Date(),
      },
      {
        id: 3,
        name: "Melhorar alimentação",
        icon: "fa-solid fa-utensils text-ic-vegano",
        description: "Desenvolver hábitos alimentares saudáveis",
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  const goal = await prisma.goal.create({
    data: {
      id_patient: patient.id,
      description: "Perder 5kg",
      target_weight: 75,
      start_date: new Date(),
      status: GoalStatus.ACTIVE,
      created_at: new Date(),
    },
  });

  await prisma.goalObjective.create({
    data: {
      id_goal: goal.id,
      id_objective: 1,
      type: "MAIN",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // PREFERENCES
  let preferencesData = [];
  try {
    preferencesData = JSON.parse(fs.readFileSync('src/assets/preferences.json', 'utf-8'));
  } catch (e) {
    console.warn('⚠️  src/assets/preferences.json não encontrado.', e.message);
  }

  if (preferencesData.length > 0) {
      const existingPrefs = await prisma.preference.findMany({
          select: { name: true }
      });
      const existingNames = new Set(existingPrefs.map(p => p.name));

      const newPrefs = preferencesData.filter(p => !existingNames.has(p.name));

      if (newPrefs.length > 0) {
           await prisma.preference.createMany({
            data: newPrefs.map(p => ({ ...p, created_at: new Date() })),
          });
          console.log(`✅ ${newPrefs.length} preferências inseridas`);
      }
  }

  const preference = await prisma.preference.findFirst();

  // DIETARY RESTRICTION
  const dietaryRestriction = await prisma.dietaryRestriction.create({
    data: { name: "Nenhuma", created_at: new Date() },
  });
  const dietaryRestriction2 = await prisma.dietaryRestriction.create({
    data: { name: "Sem glúten", icon: "fa-wheat-awn-circle-exclamation", created_at: new Date() },
  });

  const dietaryRestriction3 = await prisma.dietaryRestriction.create({
    data: { name: "Sem lactose", icon: "fa-solid fa-droplet-slash", created_at: new Date() },
  });

  const dietaryRestriction4 = await prisma.dietaryRestriction.create({
    data: { name: "Vegano", icon: "fa-solid fa-seedling", created_at: new Date() },
  });

  const dietaryRestriction5 = await prisma.dietaryRestriction.create({
    data: { name: "Vegetariano", icon: "fa-solid fa-leaf", created_at: new Date() },
  });

  const dietaryRestriction6 = await prisma.dietaryRestriction.create({
    data: { name: "Sem açúcar", icon:"fa-solid fa-candy-cane", created_at: new Date() },
  });
  const dietaryRestriction7 = await prisma.dietaryRestriction.create({
    data: { name: "Sem nozes", icon: "fa-solid fa-brain", created_at: new Date() },
  });
  const dietaryRestriction8 = await prisma.dietaryRestriction.create({
    data: { name: "Sem frutos do mar", icon: "fa-solid fa-fish", created_at: new Date() },
  });

  
  const mealBreakfast = await prisma.meal.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "Café da manhã", created_at: new Date() },
  });
  
  const mealMorningSnack = await prisma.meal.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: "Lanche da manhã", created_at: new Date() },
  });
  
  const mealLunch = await prisma.meal.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: "Almoço", created_at: new Date() },
  });
  
  const mealAfternoonSnack = await prisma.meal.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, name: "Café da tarde", created_at: new Date() },
  });
  
  const mealDinner = await prisma.meal.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, name: "Janta", created_at: new Date() },
  });
  
  const mealNightSnack = await prisma.meal.upsert({
    where: { id: 6 },
    update: {},
    create: { id: 6, name: "Lanche da noite", created_at: new Date() },
  });

  console.log('✅ 6 refeições base criadas (IDs 1-6)');

  // MEAL PREFERENCES
  await prisma.mealPreference.create({
    data: {
      id_meal: mealBreakfast.id,
      id_preference: preference.id,
      created_at: new Date(),
    },
  });


  // UNIT OF MEASUREMENT
  try {
    const unitsData = JSON.parse(fs.readFileSync('src/assets/units_of_measurement.json', 'utf-8'));
    await prisma.unitOfMeasurement.createMany({
      data: unitsData.map(u => ({ ...u, created_at: new Date() })),
      skipDuplicates: true,
    });
    console.log('✅ Unidades de medida inseridas');
  } catch (e) {
    console.warn('⚠️  src/assets/units_of_measurement.json não encontrado. Criando apenas Grama.', e.message);
    await prisma.unitOfMeasurement.create({
      data: { name: "Grama", symbol: "g", created_at: new Date() },
    });
  }
  
  const gram = await prisma.unitOfMeasurement.findFirst({ where: { name: "Grama" } });

  // REPORT
  await prisma.report.create({
    data: {
      id_patient: patient.id,
      type: ReportType.CHECKUP,
      generated_at: new Date(),
      created_at: new Date(),
    },
  });

  // GROUP & USER GROUP
  const groupEndDate = new Date();
  groupEndDate.setDate(groupEndDate.getDate() + 15);
  
  const group = await prisma.group.create({
    data: {
      name: "Grupo Fitness",
      invite_code: "FIT123",
      end_date: groupEndDate,
      created_at: new Date(),
    },
  });
  await prisma.userGroup.create({
    data: {
      id_user: patientUser.id,
      id_group: group.id,
      role: UserGroupRole.ADMIN,
      created_at: new Date(),
    },
  });

  // NUTRITIONIST PATIENT (link table)
  await prisma.nutritionistPatient.create({
    data: {
      id_nutritionist: nutritionist.id,
      id_patient: patient.id,
      created_at: new Date(),
    },
  });

  await populateWithAI(patient, nutritionist, goal);

  console.log("Seed finished.");
}

async function populateWithAI(patient, nutritionist, goal) {

  let foods = [];
  let recipes = [];
  let mealplans = [];

  try {
    foods = JSON.parse(fs.readFileSync('src/assets/foods.json', 'utf-8'));
    console.log(`✅ ${foods.length} alimentos carregados`);
  } catch (e) {
    console.warn('⚠️  src/assets/foods.json não encontrado. Execute: node generate-data.js');
  }

  try {
    recipes = JSON.parse(fs.readFileSync('src/assets/recipes.json', 'utf-8'));
    console.log(`✅ ${recipes.length} receitas carregadas`);
  } catch (e) {
    console.warn('⚠️  src/assets/recipes.json não encontrado. Execute: node generate-data.js');
  }

  try {
    mealplans = JSON.parse(fs.readFileSync('src/assets/mealplans.json', 'utf-8'));
    console.log(`✅ ${mealplans.length} planos carregados`);
  } catch (e) {
    console.warn('⚠️  src/assets/mealplans.json não encontrado. Execute: node generate-data.js');
  }

  if (foods.length > 0) {
    await prisma.food.createMany({
      data: foods.map(food => ({ ...food, created_at: new Date() })),
      skipDuplicates: true,
    });
    console.log('✅ Alimentos inseridos');
  }

  if (recipes.length > 0) {
    const recipesWithPref = recipes.map(recipe => {
      let prefId = null;
      const name = recipe.name.toLowerCase();
      
      // 1: Café da manhã, 2: Lanche da manhã, 3: Almoço, 4: Café da tarde, 5: Janta, 6: Lanche da noite
      
      if (name.includes('café') || name.includes('pão') || name.includes('tapioca') || name.includes('ovo') || name.includes('vitamina') || name.includes('bolo') || name.includes('panqueca') || name.includes('mingau') || name.includes('iogurte') || name.includes('fruta') || name.includes('suco') || name.includes('torrada') || name.includes('sanduíche') || name.includes('queijo') || name.includes('biscoito')) {
        prefId = 1; // Default to Breakfast/Snack
        if (name.includes('lanche') || name.includes('tarde')) prefId = 4;
      }
      
      if (name.includes('arroz') || name.includes('feijão') || name.includes('carne') || name.includes('frango') || name.includes('peixe') || name.includes('macarrão') || name.includes('salada') || name.includes('sopa') || name.includes('legumes') || name.includes('purê') || name.includes('batata') || name.includes('bife') || name.includes('lasanha') || name.includes('estrogonofe') || name.includes('assado') || name.includes('grelhado') || name.includes('cozido')) {
        prefId = 3; // Default to Lunch
        if (name.includes('sopa') || name.includes('caldo') || name.includes('leve')) prefId = 5; // Dinner preference
      }
      
      return { ...recipe, pref_meal_id: prefId, created_at: new Date() };
    });

    await prisma.recipe.createMany({
      data: recipesWithPref,
      skipDuplicates: true,
    });
    console.log('✅ Receitas inseridas com pref_meal_id');
  }

  if (mealplans.length > 0) {
    for (const plan of mealplans) {
      const { id_patient, status, ...planData } = plan;
      
      const newPlan = await prisma.mealPlan.create({
        data: {
          ...planData,
          id_nutritionist: nutritionist.id,
          id_objective: 1, 
          created_at: new Date(),
        },
      });
      
      await prisma.mealPlanPatient.create({
        data: {
          id_meal_plan: newPlan.id,
          id_patient: patient.id,
          status: MealPlanStatus.ACTIVE,
          created_at: new Date(),
        }
      });
    }
    console.log('✅ Planos inseridos');
  }

  // RECIPE FOODS (Relations)
  try {
    const recipeFoodsData = JSON.parse(fs.readFileSync('src/assets/recipe_foods.json', 'utf-8'));

    const allFoods = await prisma.food.findMany();
    const allRecipes = await prisma.recipe.findMany();
    const allUnits = await prisma.unitOfMeasurement.findMany();
    const prepMethod = await prisma.preparationMethod.findFirst();

    const foodMap = new Map(allFoods.map(f => [f.name.toLowerCase(), f.id]));
    const recipeMap = new Map(allRecipes.map(r => [r.name.toLowerCase(), r.id]));
    const unitMap = new Map(allUnits.map(u => [u.name.toLowerCase(), u.id]));

    const recipeFoodsToInsert = [];

    for (const rf of recipeFoodsData) {
      const recipeId = recipeMap.get(rf.recipe_name.toLowerCase());
      const foodId = foodMap.get(rf.food_name.toLowerCase());
      const unitId = unitMap.get(rf.unit.toLowerCase());

      if (recipeId && foodId) {
        recipeFoodsToInsert.push({
          id_recipe: recipeId,
          id_food: foodId,
          id_unit_of_measurement: unitId || (allUnits[0] ? allUnits[0].id : 1),
          id_preparation_method: prepMethod ? prepMethod.id : null,
          quantity: rf.quantity || 1,
          created_at: new Date(),
        });
      }
    }

    if (recipeFoodsToInsert.length > 0) {
      await prisma.recipeFood.createMany({
        data: recipeFoodsToInsert,
        skipDuplicates: true,
      });
      console.log('✅ Relações receita-alimento inseridas');
    }

  } catch (e) {
    console.warn('⚠️  src/assets/recipe_foods.json não encontrado ou erro ao processar.', e.message);
  }



  // RECIPE PREFERENCES (Relations)
  try {
    const recipePrefsData = JSON.parse(fs.readFileSync('src/assets/recipe_preferences.json', 'utf-8'));

    const allRecipes = await prisma.recipe.findMany();
    const allPreferences = await prisma.preference.findMany();

    const recipeMap = new Map(allRecipes.map(r => [r.name.toLowerCase(), r.id]));
    const preferenceMap = new Map(allPreferences.map(p => [p.name.toLowerCase(), p.id]));

    const recipePrefsToInsert = [];

    for (const rp of recipePrefsData) {
      const recipeId = recipeMap.get(rp.recipe_name.toLowerCase());
      const preferenceId = preferenceMap.get(rp.preference_name.toLowerCase());

      if (recipeId && preferenceId) {
        recipePrefsToInsert.push({
          id_recipe: recipeId,
          id_preference: preferenceId,
          created_at: new Date(),
        });
      }
    }

    if (recipePrefsToInsert.length > 0) {
      await prisma.recipePreference.createMany({
        data: recipePrefsToInsert,
        skipDuplicates: true,
      });
      console.log('✅ Relações receita-preferência inseridas');
    }

  } catch (e) {
    console.warn('⚠️  src/assets/recipe_preferences.json não encontrado ou erro ao processar.', e.message);
  }

  // 12. Seed Food Portions
  console.log('Seeding Food Portions...');
  try {
    const portionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/assets/food_portions.json'), 'utf-8'));
    
    const unitsMap = new Map();
    const allUnits = await prisma.unitOfMeasurement.findMany();
    allUnits.forEach(u => unitsMap.set(u.name.toLowerCase(), u.id));
    unitsMap.set('colher de sopa', unitsMap.get('colher de sopa')); 
    unitsMap.set('colher de chá', unitsMap.get('colher de chá'));
    
    const foodsMap = new Map();
    const allFoods = await prisma.food.findMany();
    allFoods.forEach(f => foodsMap.set(f.name.toLowerCase(), f.id));

    for (const portion of portionsData) {
      const foodId = foodsMap.get(portion.food_name.toLowerCase());
      const unitId = unitsMap.get(portion.unit_name.toLowerCase());

      if (foodId && unitId) {
        await prisma.foodPortion.create({
          data: {
            id_food: foodId,
            id_unit_of_measurement: unitId,
            gram_weight: portion.gram_weight,
            description: portion.description
          }
        });
      } else {
        console.warn(`Skipping portion for ${portion.food_name} - ${portion.unit_name}: Food or Unit not found.`);
      }
    }
    console.log('✅ Porções de alimentos inseridas');
  } catch (e) {
    console.warn('⚠️  src/assets/food_portions.json não encontrado ou erro ao processar.', e.message);
  }

  // 13. Calculate Recipe Calories
  console.log('Calculating Recipe Calories...');
  const recipesToUpdate = await prisma.recipe.findMany({
    include: {
      recipeFoods: {
        include: {
          food: {
            include: {
              portions: true
            }
          },
          unit_of_measurement: true
        }
      }
    }
  });

  for (const recipe of recipesToUpdate) {
    let totalCalories = 0;

    for (const rf of recipe.recipeFoods) {
      const food = rf.food;
      const unit = rf.unit_of_measurement;
      const qty = rf.quantity;
      
      let grams = 0;
      
      if (['g', 'grama', 'gramas'].includes(unit.name.toLowerCase()) || unit.symbol === 'g') {
        grams = qty;
      } else if (['ml', 'mililitro', 'mililitros'].includes(unit.name.toLowerCase()) || unit.symbol === 'ml') {
        grams = qty; 
      } else if (['kg', 'quilograma'].includes(unit.name.toLowerCase()) || unit.symbol === 'kg') {
        grams = qty * 1000;
      } else if (['l', 'litro'].includes(unit.name.toLowerCase()) || unit.symbol === 'l') {
        grams = qty * 1000;
      } else {
        const portion = food.portions.find(p => p.id_unit_of_measurement === unit.id);
        if (portion) {
          grams = qty * portion.gram_weight;
        } else {
          // console.warn(`No portion found for ${food.name} in ${unit.name} (Recipe: ${recipe.name})`);
        }
      }

      if (grams > 0) {
        const cal = (food.calories / 100) * grams;
        totalCalories += cal;
      }
    }

    if (totalCalories > 0) {
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { calories: Math.round(totalCalories) } 
      });
    }
  }
  console.log('✅ Calorias das receitas calculadas');

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
