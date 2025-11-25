
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up recipe data...');

  await prisma.recipePreference.deleteMany({});
  console.log('Deleted RecipePreference');

  await prisma.recipeFood.deleteMany({});
  console.log('Deleted RecipeFood');

  await prisma.mealPlanRecipe.deleteMany({});
  console.log('Deleted MealPlanRecipe');

  await prisma.foodConsumed.deleteMany({
    where: {
      id_recipe: { not: null }
    }
  });
  console.log('Deleted FoodConsumed (recipes)');

  await prisma.favoriteRecipe.deleteMany({});
  console.log('Deleted FavoriteRecipe');

  await prisma.recipe.deleteMany({});
  console.log('Deleted Recipe');

  console.log('✨ Cleanup finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
