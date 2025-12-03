import { MealPlanMealRepository } from '../repositories/MealPlanMealRepository.js'
import { MealPlanRecipeRepository } from '../repositories/MealPlanRecipeRepository.js'
import { RecipeRepository } from '../repositories/RecipeRepository.js'
import { MealPlanRepository } from '../repositories/MealPlanRepository.js'
import { AppError } from '../exceptions/AppError.js'

const populateMealPlan = async (mealPlanId, options = {}) => {
  try {
    const {
      daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    } = options

    const mealPlan = await MealPlanRepository.findById(mealPlanId)
    if (!mealPlan) throw new AppError({ message: 'Plano alimentar não encontrado' })

    const targetCalories = mealPlan.calories
    const patient = mealPlan.mealPlanPatients?.[0]?.patient
    
    const { data: allRecipes = [] } = await RecipeRepository.search({
      limit: 1000,
      orderColumn: 'id',
      order: 'asc'
    })

    if (allRecipes.length === 0) {
      throw new AppError({ message: 'Nenhuma receita disponível no sistema' })
    }
    
    const patientRestrictions = mealPlan.mealPlanDietaryRestrictions?.map(mpdr => mpdr.dietaryRestriction.name.toLowerCase()) || []
    const patientObjectives = mealPlan.objective ? [mealPlan.objective.name.toLowerCase()] : []

    const validRecipes = allRecipes.filter(recipe => {
      const recipePrefs = recipe.recipePreferences.map(rp => rp.preference.name.toLowerCase())
      
      if (patientRestrictions.some(r => r.includes('glúten')) && !recipePrefs.includes('sem glúten')) return false
      if (patientRestrictions.some(r => r.includes('lactose')) && !recipePrefs.includes('sem lactose')) return false
      if (patientRestrictions.some(r => r.includes('açúcar')) && !recipePrefs.includes('sem açúcar')) return false
      if (patientRestrictions.some(r => r.includes('carne')) && !recipePrefs.some(p => p.includes('vegetariano') || p.includes('vegano'))) return false
      
      return true
    })

    if (validRecipes.length === 0) {
      console.warn('⚠️ Nenhuma receita compatível com as restrições encontradas. Usando todas.')
    }
    
    const recipesPool = validRecipes.length > 0 ? validRecipes : allRecipes

    const mealDistribution = [
      { id: 1, name: 'Café da manhã', percent: 0.20 },
      { id: 2, name: 'Lanche da manhã', percent: 0.10 },
      { id: 3, name: 'Almoço', percent: 0.35 },
      { id: 4, name: 'Café da tarde', percent: 0.10 },
      { id: 5, name: 'Janta', percent: 0.20 },
      { id: 6, name: 'Lanche da noite', percent: 0.05 }
    ]

    let totalMealsCreated = 0
    let totalRecipesAssigned = 0

    for (const day of daysOfWeek) {
      let dailyCalories = 0
      const usedRecipeIds = new Set(); // Reset used recipes for the day
      
      for (const mealConfig of mealDistribution) {
        const targetMealCalories = targetCalories * mealConfig.percent
        
        // Smart Filtering with Fallback
        let recipesToUse = [];
        
        // Primary Preference: Exact Match
        const primaryMap = { 
            1: [1],       // Breakfast -> Breakfast (Pão, Ovo, Café, etc)
            2: [2],       // Morning Snack -> Snack (Fruta, Iogurte, Gelinho)
            3: [3],       // Lunch -> Lunch
            4: [1],       // Afternoon Coffee -> Breakfast (Pão, Bolo, Café) - NO SNACKS (Gelinho)
            5: [5],       // Dinner -> Dinner
            6: [2]        // Night Snack -> Snack
        };

        // Secondary Preference: Acceptable Alternatives
        const secondaryMap = {
            1: [],        // Breakfast: No fallback (Strict)
            2: [1],       // Morning Snack -> Breakfast (Iogurte, Vitamina ok)
            3: [5],       // Lunch -> Dinner
            4: [],        // Afternoon Coffee: No fallback (Strict)
            5: [3],       // Dinner -> Lunch
            6: [1]        // Night Snack -> Breakfast
        };

        // Filter out recipes already used today
        const availableRecipes = recipesPool.filter(r => !usedRecipeIds.has(r.id));

        // 1. Try Primary
        recipesToUse = availableRecipes.filter(r => r.pref_meal_id && primaryMap[mealConfig.id].includes(r.pref_meal_id));
        
        // 2. Try Secondary if empty
        if (recipesToUse.length === 0) {
            recipesToUse = availableRecipes.filter(r => r.pref_meal_id && secondaryMap[mealConfig.id].includes(r.pref_meal_id));
        }

        // 3. Ultimate Fallback (All recipes - ONLY if absolutely necessary)
        // We try to avoid this by having enough data. If we must, we exclude used ones.
        if (recipesToUse.length === 0) {
            console.warn(`⚠️ Fallback total para refeição ${mealConfig.id} no dia ${day}`);
            recipesToUse = availableRecipes;
        }
        
        const mealPlanMeal = await MealPlanMealRepository.create({
          id_meal_plan: mealPlanId,
          id_meal: mealConfig.id,
          day: day,
          time: getTimeForMeal(mealConfig.id),
          created_at: new Date(),
          updated_at: new Date()
        })
        totalMealsCreated++

        const selectedRecipes = selectRecipesForCalories(recipesToUse, targetMealCalories, patientObjectives)
        
        for (const recipe of selectedRecipes) {
          await MealPlanRecipeRepository.create({
            id_meal_plan_meal: mealPlanMeal.id,
            id_recipe: recipe.id,
            favorite: false,
            created_at: new Date(),
            updated_at: new Date()
          })
          totalRecipesAssigned++
          dailyCalories += (recipe.calories || 0)
          usedRecipeIds.add(recipe.id); // Mark as used
        }
      }
    }

    return {
      success: true,
      mealPlanId,
      stats: {
        mealsCreated: totalMealsCreated,
        recipesAssigned: totalRecipesAssigned,
        daysConfigured: daysOfWeek.length
      }
    }

  } catch (error) {
    console.error('❌ Erro ao popular plano alimentar:', error)
    throw error
  }
}

const getTimeForMeal = (mealId) => {
  const times = { 1: '07:00', 2: '10:00', 3: '12:00', 4: '15:00', 5: '18:00', 6: '21:00' }
  return new Date(`1970-01-01T${times[mealId] || '12:00'}:00`)
}

const selectRecipesForCalories = (recipes, targetCalories, objectives) => {
  const scoredRecipes = recipes.map(r => {
    let score = 0
    const prefs = r.recipePreferences.map(rp => rp.preference.name.toLowerCase())
    
    // Pontuação baseada em correspondência de objetivos
    objectives.forEach(obj => {
      const objLower = obj.toLowerCase();
      
      if (prefs.some(p => p.includes(objLower) || objLower.includes(p))) score += 5 // Reduced from 10 to allow more variety
      
      if (objLower.includes('perda') || objLower.includes('emagrecer')) {
         if (prefs.includes('low carb') || prefs.includes('fitness') || prefs.includes('leve')) score += 3;
         if (r.calories < 400) score += 2; 
      }
      
      if (objLower.includes('ganho') || objLower.includes('massa') || objLower.includes('hipertrofia')) {
         if (prefs.includes('proteico') || prefs.includes('energia') || prefs.includes('ganho de massa')) score += 3;
         if (r.calories > 400) score += 2; 
      }
    })
    
    if (r.calories > 0) score += 1
    
    // Increased Random Factor significantly to ensure variety
    score += Math.random() * 15 
    
    return { ...r, score }
  }).sort((a, b) => b.score - a.score)

  
  const selected = []
  let currentCalories = 0
  
  // Shuffle top 5 candidates to ensure we don't always pick the #1 score
  const topCandidates = scoredRecipes.slice(0, 10).sort(() => Math.random() - 0.5);
  
  // Tenta encontrar uma receita principal que se encaixe no alvo
  const mainRecipe = topCandidates.find(r => {
    if (!r.calories) return true 
    return r.calories >= targetCalories * 0.4 && r.calories <= targetCalories * 1.2
  }) || scoredRecipes[0]; // Fallback to highest score if random pick fails
  
  if (mainRecipe) {
    selected.push(mainRecipe)
    currentCalories += (mainRecipe.calories || 0)
  }
  
  // Se ainda faltar muitas calorias, tenta adicionar um acompanhamento
  if (currentCalories < targetCalories * 0.7) {
    const remaining = targetCalories - currentCalories
    const sideDish = scoredRecipes.find(r => {
      if (selected.some(s => s.id === r.id)) return false 
      if (!r.calories) return true
      return r.calories <= remaining * 1.5 
    })
    
    if (sideDish) selected.push(sideDish)
  }
  
  return selected
}

export const MealPlanPopulateService = {
  populateMealPlan
}
