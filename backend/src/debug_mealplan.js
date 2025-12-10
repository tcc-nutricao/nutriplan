
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const checkPatient = async (patientId) => {
    // Check Plans
    const plans = await prisma.mealPlan.findMany({
        where: { mealPlanPatients: { some: { id_patient: patientId } } },
        include: { mealPlanPatients: true, mealPlanMeals: { include: { mealPlanRecipes: true } } },
        orderBy: { created_at: 'desc' }
    });
    
    console.log(`Found ${plans.length} plans for Patient ${patientId}.`);
    
    if (plans.length > 0) {
        const top = plans[0];
        const status = top.mealPlanPatients[0]?.status;
        console.log(`Latest Plan ID: ${top.id}, Status: ${status}, Meals: ${top.mealPlanMeals.length}, Created: ${top.created_at}`);
        if(top.mealPlanMeals.length > 0) {
             const rCount = top.mealPlanMeals.reduce((acc, m) => acc + m.mealPlanRecipes.length, 0);
             console.log(` - Recipes assigned: ${rCount}`);
        }
    }
    
    // Check Restrictions
    const restrictions = await prisma.patientDietaryRestriction.findMany({
        where: { id_patient: patientId, deleted_at: null },
        include: { dietaryRestriction: true }
    });
    console.log('Active Restrictions:', restrictions.map(r => r.dietaryRestriction?.name));
};

const debug = async () => {
    try {
        console.log('--- DEBUG START ---');
        
        const recipeCount = await prisma.recipe.count();
        console.log('Total Recipes in DB:', recipeCount);
        
        const patients = await prisma.patient.findMany({ include: { user: true } });
        console.log(`Found ${patients.length} patients.`);
        
        for (const p of patients) {
            console.log(`Checking Patient: ${p.user?.name} (${p.user?.email}) ID: ${p.id}`);
            await checkPatient(p.id);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

debug();
