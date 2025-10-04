import { PrismaClient, Role, GoalStatus, MealPlanStatus, ReportType, UserGroupRole, WeekDay } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // USERS
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@example.com', password: 'hashed_admin', role: Role.PROFESSIONAL }
  });
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: { name: 'Paciente', email: 'patient@example.com', password: 'hashed_patient', role: Role.STANDARD }
  });
  const nutritionistUser = await prisma.user.upsert({
    where: { email: 'nutri@example.com' },
    update: {},
    create: { name: 'Nutri', email: 'nutri@example.com', password: 'hashed_nutri', role: Role.PROFESSIONAL }
  });

  // NUTRITIONIST
  const nutritionist = await prisma.nutritionist.upsert({
    where: { id_user: nutritionistUser.id },
    update: {},
    create: { id_user: nutritionistUser.id, professional_register: 'CRN12345', created_at: new Date() }
  });

  // PATIENT
  const patient = await prisma.patient.upsert({
    where: { id_user: patientUser.id },
    update: {},
    create: { 
      id_user: patientUser.id, 
      id_nutritionist: nutritionist.id, 
      birth_date: new Date('1990-01-01'),
      gender: 'FEM',
      height: 175,
      weight: 70,
      profile_picture: null,
      created_at: new Date()
    }
  });

  // HEALTH DATA
  await prisma.healthData.createMany({
    data: [
      { id_patient: patient.id, height: 1.72, weight: 80, bmi: 80 / (1.72 * 1.72), record_date: new Date(), created_at: new Date() },
    ],
    skipDuplicates: true
  });

  // OBJECTIVES & GOALS
  const objective = await prisma.objective.create({
    data: { name: 'Perder Peso', description: 'Reduzir gordura corporal', created_at: new Date() }
  });

  const goal = await prisma.goal.create({
    data: { id_patient: patient.id, description: 'Perder 5kg', start_date: new Date(), status: GoalStatus.ACTIVE, created_at: new Date() }
  });

  await prisma.goalObjective.create({
    data: { id_goal: goal.id, id_objective: objective.id, created_at: new Date() }
  });

  // PREFERENCES
  const preference = await prisma.preference.create({
    data: { name: 'Sem lactose', created_at: new Date() }
  });

  // DIETARY RESTRICTION
  const dietaryRestriction = await prisma.dietaryRestriction.create({
    data: { name: 'Glúten', created_at: new Date() }
  });

  // MEAL BASE
  const mealBreakfast = await prisma.meal.create({
    data: { name: 'Café da manhã', created_at: new Date() }
  });
  const mealLunch = await prisma.meal.create({
    data: { name: 'Almoço', created_at: new Date() }
  });

  // MEAL PLAN
  const mealPlan = await prisma.mealPlan.create({
    data: {
      id_patient: patient.id,
      id_nutritionist: nutritionist.id,
      id_goal: goal.id,
      calories: 2000,
      status: MealPlanStatus.ACTIVE,
      created_at: new Date()
    }
  });

  // MEAL PLAN MEALS
  const planBreakfast = await prisma.mealPlanMeal.create({
    data: { id_meal_plan: mealPlan.id, id_meal: mealBreakfast.id, time: new Date(), day: WeekDay.MON, created_at: new Date() }
  });
  const planLunch = await prisma.mealPlanMeal.create({
    data: { id_meal_plan: mealPlan.id, id_meal: mealLunch.id, time: new Date(), day: WeekDay.MON, created_at: new Date() }
  });

  // MEAL PREFERENCES
  await prisma.mealPreference.create({
    data: { id_meal: mealBreakfast.id, id_preference: preference.id, created_at: new Date() }
  });

  // MEAL PLAN DIETARY RESTRICTION
  await prisma.mealPlanDietaryRestriction.create({
    data: { id_dietary_restriction: dietaryRestriction.id, id_meal_plan: mealPlan.id, created_at: new Date() }
  });

  // FOODS
  const banana = await prisma.food.create({
    data: { name: 'Banana', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, created_at: new Date() }
  });
  const rice = await prisma.food.create({
    data: { name: 'Arroz', calories: 130, protein: 2.4, carbs: 28, fat: 0.2, created_at: new Date() }
  });

  // UNIT OF MEASUREMENT
  const gram = await prisma.unitOfMeasurement.create({
    data: { name: 'Grama', symbol: 'g', created_at: new Date() }
  });

  // RECIPE
  const recipe = await prisma.recipe.create({
    data: { name: 'Vitamina de Banana', calories: 180, preparation_time: 5, portion: 1, created_at: new Date() }
  });

  // PREPARATION METHOD
  const prepMethod = await prisma.preparationMethod.create({
    data: { name: 'Cru', created_at: new Date() }
  });

  // RECIPE FOOD
  await prisma.recipeFood.createMany({
    data: [
      { id_food: banana.id, id_recipe: recipe.id, id_unit_of_measurement: gram.id, id_preparation_method: prepMethod.id, nutrition_value: 100, created_at: new Date() },
      { id_food: rice.id, id_recipe: recipe.id, id_unit_of_measurement: gram.id, id_preparation_method: prepMethod.id, nutrition_value: 50, created_at: new Date() }
    ]
  });

  // FOOD CONSUMED (one with food, one with recipe)
  await prisma.foodConsumed.create({
    data: { id_meal_plan_meal: planBreakfast.id, id_food: banana.id, id_unit_of_measurement: gram.id, quantity: 120, date: new Date(), created_at: new Date(), updated_at: new Date() }
  });
  await prisma.foodConsumed.create({
    data: { id_meal_plan_meal: planLunch.id, id_recipe: recipe.id, id_unit_of_measurement: gram.id, quantity: 1, date: new Date(), created_at: new Date(), updated_at: new Date() }
  });

  // REPORT
  await prisma.report.create({
    data: { id_patient: patient.id, type: ReportType.CHECKUP, generated_at: new Date(), created_at: new Date() }
  });

  // GROUP & USER GROUP
  const group = await prisma.group.create({
    data: { name: 'Grupo Fitness', invite_code: 'FIT123', created_at: new Date() }
  });
  await prisma.userGroup.create({
    data: { id_user: patientUser.id, id_group: group.id, role: UserGroupRole.MEMBER, created_at: new Date() }
  });

  // NUTRITIONIST PATIENT (link table)
  await prisma.nutritionistPatient.create({
    data: { id_nutritionist: nutritionist.id, id_patient: patient.id, created_at: new Date() }
  });

  console.log('Seed finished.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
