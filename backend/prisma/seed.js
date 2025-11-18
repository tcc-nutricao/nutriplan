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
import bcrypt from 'bcrypt';

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
        name: "Ganho de peso",
        icon: "fa-solid fa-dumbbell text-ic-musculo",
        description: "Aumentar peso corporal de forma saudável",
        created_at: new Date(),
      },
      {
        id: 3,
        name: "Manutenção de peso",
        icon: "fa-solid fa-scale-balanced text-ic-manterpeso",
        description: "Manter o peso atual dentro de uma faixa saudável",
        created_at: new Date(),
      },
      {
        id: 4,
        name: "Redução de IMC",
        icon: "fa-solid fa-chart-line text-ic-emagrecer",
        description: "Diminuir o índice de massa corporal",
        created_at: new Date(),
      },
      {
        id: 5,
        name: "Reeducação alimentar",
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
      target_weight: 75, // Peso alvo: de 80kg para 75kg
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
  await prisma.preference.createMany({
    data: [
      { name: "Sem Glúten", icon: "fa-wheat-awn text-ic-gluten", created_at: new Date() },
      { name: "Sem açúcar", icon: "fa-candy-cane text-ic-sugar", created_at: new Date() },
      { name: "Sem lactose", icon: "fa-glass-water text-ic-lactose", created_at: new Date() },
      { name: "Vegetariano", icon: "fa-carrot text-ic-vegetariano", created_at: new Date() },
      { name: "Vegano", icon: "fa-seedling text-ic-vegano", created_at: new Date() },
      { name: "Emagrecer", icon: "fa-fire text-ic-emagrecer", created_at: new Date() },
      { name: "Ganho de músculo", icon: "fa-dumbbell text-ic-musculo", created_at: new Date() },
      { name: "Manter peso", icon: "fa-scale-balanced text-ic-manterpeso", created_at: new Date() },
      { name: "Colesterol", icon: "fa-heart-circle-plus text-ic-colesterol", created_at: new Date() },
      { name: "Sono", icon: "fa-moon text-ic-sono", created_at: new Date() },
      { name: "Energia", icon: "fa-bolt text-ic-energia", created_at: new Date() },
      { name: "Antinflamatório", icon: "fa-droplet text-ic-antinfl", created_at: new Date() },
      { name: "Antioxidante", icon: "fa-atom text-ic-antiox", created_at: new Date() },
      { name: "Sem nozes", icon: "fa-hand-dots text-ic-nozes", created_at: new Date() },
      { name: "Sem peixe", icon: "fa-fish text-ic-peixe", created_at: new Date() },
      { name: "Intestino", icon: "fa-worm text-ic-intestino", created_at: new Date() },
      { name: "Fácil", icon: "fa-hands text-ic-vegan", created_at: new Date() },
      { name: "Doce", icon: "fa-ice-cream text-ic-sono", created_at: new Date() },
    ],
    skipDuplicates: true,
  });

    // Pega a primeira preferência para uso nos relacionamentos
  const preference = await prisma.preference.findFirst();
  // DIETARY RESTRICTION
  const dietaryRestriction = await prisma.dietaryRestriction.create({
    data: { name: "Nenhuma", created_at: new Date() },
  });
  const dietaryRestriction2 = await prisma.dietaryRestriction.create({
    data: { name: "Sem glúten", created_at: new Date() },
  });

  const dietaryRestriction3 = await prisma.dietaryRestriction.create({
    data: { name: "Sem lactose", created_at: new Date() },
  });

  const dietaryRestriction4 = await prisma.dietaryRestriction.create({
    data: { name: "Vegano", created_at: new Date() },
  });

  const dietaryRestriction5 = await prisma.dietaryRestriction.create({
    data: { name: "Vegetariano", created_at: new Date() },
  });

  // MEAL BASE (6 refeições fixas - IDs 1 a 6)
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

  // FOODS
  const banana = await prisma.food.create({
    data: {
      name: "Banana",
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      created_at: new Date(),
    },
  });
  const rice = await prisma.food.create({
    data: {
      name: "Arroz",
      calories: 130,
      protein: 2.4,
      carbs: 28,
      fat: 0.2,
      created_at: new Date(),
    },
  });

  // UNIT OF MEASUREMENT
  const gram = await prisma.unitOfMeasurement.create({
    data: { name: "Grama", symbol: "g", created_at: new Date() },
  });

  // RECIPE
  const recipe = await prisma.recipe.create({
    data: {
      name: "Vitamina de Banana",
      preparation_time: 5,
      portion: 1,
      created_at: new Date(),
    },
  });

  // RECIPE OBJECTIVE (associa a receita ao objetivo de perda de peso - id 1)
  await prisma.recipeObjective.create({
    data: { id_objective: 1, id_recipe: recipe.id },
  });

  // PREPARATION METHOD
  const prepMethod = await prisma.preparationMethod.create({
    data: { name: "Cru", created_at: new Date() },
  });

  // RECIPE FOOD
  await prisma.recipeFood.createMany({
    data: [
      {
        id_food: banana.id,
        id_recipe: recipe.id,
        id_unit_of_measurement: gram.id,
        id_preparation_method: prepMethod.id,
        quantity: 100,
        created_at: new Date(),
      },
      {
        id_food: rice.id,
        id_recipe: recipe.id,
        id_unit_of_measurement: gram.id,
        id_preparation_method: prepMethod.id,
        quantity: 50,
        created_at: new Date(),
      },
    ],
  });

  // FOOD CONSUMED (one with food, one with recipe)
  // Comentado porque não temos meal plan criado na seed
  // await prisma.foodConsumed.create({
  //   data: {
  //     id_meal_plan_meal: planBreakfast.id,
  //     id_food: banana.id,
  //     id_unit_of_measurement: gram.id,
  //     quantity: 120,
  //     date: new Date(),
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   },
  // });
  // await prisma.foodConsumed.create({
  //   data: {
  //     id_meal_plan_meal: planLunch.id,
  //     id_recipe: recipe.id,
  //     id_unit_of_measurement: gram.id,
  //     quantity: 1,
  //     date: new Date(),
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   },
  // });

  // MEAL PLAN RECIPE (associa a receita ao plano de refeição)
  // Comentado porque não temos meal plan criado na seed
  // await prisma.mealPlanRecipe.create({
  //   data: {
  //     id_recipe: recipe.id,
  //     id_meal_plan_meal: planBreakfast.id,
  //     favorite: true,
  //     created_at: new Date(),
  //   },
  // });

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
  const group = await prisma.group.create({
    data: {
      name: "Grupo Fitness",
      invite_code: "FIT123",
      created_at: new Date(),
    },
  });
  await prisma.userGroup.create({
    data: {
      id_user: patientUser.id,
      id_group: group.id,
      role: UserGroupRole.MEMBER,
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

  // Popula com dados AI
  await populateWithAI(patient, nutritionist, goal);

  console.log("Seed finished.");
}

async function populateWithAI(patient, nutritionist, goal) {
  console.log("Carregando dados gerados por IA dos arquivos JSON...");

  // Lê os arquivos gerados (devem ser criados previamente com: node generate-data.js)
  let foods = [];
  let recipes = [];
  let mealplans = [];

  try {
    foods = JSON.parse(fs.readFileSync('src/assets/foods.json', 'utf-8'));
    console.log(`✓ ${foods.length} alimentos carregados`);
  } catch (e) {
    console.warn('⚠️  src/assets/foods.json não encontrado. Execute: node generate-data.js');
  }

  try {
    recipes = JSON.parse(fs.readFileSync('src/assets/recipes.json', 'utf-8'));
    console.log(`✓ ${recipes.length} receitas carregadas`);
  } catch (e) {
    console.warn('⚠️  src/assets/recipes.json não encontrado. Execute: node generate-data.js');
  }

  try {
    mealplans = JSON.parse(fs.readFileSync('src/assets/mealplans.json', 'utf-8'));
    console.log(`✓ ${mealplans.length} planos carregados`);
  } catch (e) {
    console.warn('⚠️  src/assets/mealplans.json não encontrado. Execute: node generate-data.js');
  }

  // Insere os foods em lote
  if (foods.length > 0) {
    console.log(`Inserindo ${foods.length} alimentos no banco...`);
    await prisma.food.createMany({
      data: foods.map(food => ({ ...food, created_at: new Date() })),
      skipDuplicates: true,
    });
    console.log('✓ Alimentos inseridos');
  }

  // Insere as recipes em lote
  if (recipes.length > 0) {
    console.log(`Inserindo ${recipes.length} receitas no banco...`);
    await prisma.recipe.createMany({
      data: recipes.map(recipe => ({ ...recipe, created_at: new Date() })),
      skipDuplicates: true,
    });
    console.log('✓ Receitas inseridas');
  }

  // Insere os mealplans (vincule a um paciente/nutricionista/goal válido)
  if (mealplans.length > 0) {
    console.log(`Inserindo ${mealplans.length} planos no banco...`);
    // Como mealplans precisam de relacionamentos, inserimos um por um
    for (const plan of mealplans) {
      await prisma.mealPlan.create({
        data: {
          ...plan,
          id_patient: patient.id,
          id_nutritionist: nutritionist.id,
          id_goal: goal.id,
          created_at: new Date(),
        },
      });
    }
    console.log('✓ Planos inseridos');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
