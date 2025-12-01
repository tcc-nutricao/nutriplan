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
      
      for (const mealConfig of mealDistribution) {
        const targetMealCalories = targetCalories * mealConfig.percent
        
        const mealPlanMeal = await MealPlanMealRepository.create({
          id_meal_plan: mealPlanId,
          id_meal: mealConfig.id,
          day: day,
          time: getTimeForMeal(mealConfig.id),
          created_at: new Date(),
          updated_at: new Date()
        })
        totalMealsCreated++

        const selectedRecipes = selectRecipesForCalories(recipesPool, targetMealCalories, patientObjectives)
        
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
      // Melhora a correspondência: verifica se a preferência contém o objetivo ou vice-versa
      // Ex: Objetivo "Ganho de massa" vs Preferência "Hipertrofia" (precisa de mapeamento ou verificação mais ampla)
      
      if (prefs.some(p => p.includes(objLower) || objLower.includes(p))) score += 10
      
      // Lógica específica para objetivos comuns
      if (objLower.includes('perda') || objLower.includes('emagrecer')) {
         if (prefs.includes('low carb') || prefs.includes('fitness') || prefs.includes('leve')) score += 5;
         if (r.calories < 400) score += 3; // Favorece receitas menos calóricas
      }
      
      if (objLower.includes('ganho') || objLower.includes('massa') || objLower.includes('hipertrofia')) {
         if (prefs.includes('proteico') || prefs.includes('energia') || prefs.includes('ganho de massa')) score += 5;
         if (r.calories > 400) score += 3; // Favorece receitas mais calóricas
      }
    })
    
    if (r.calories > 0) score += 1
    
    score += Math.random() * 2 // Fator de aleatoriedade reduzido para não sobrepor a relevância
    
    return { ...r, score }
  }).sort((a, b) => b.score - a.score)

  
  const selected = []
  let currentCalories = 0
  
  // Tenta encontrar uma receita principal que se encaixe no alvo
  const mainRecipe = scoredRecipes.find(r => {
    if (!r.calories) return true 
    return r.calories >= targetCalories * 0.4 && r.calories <= targetCalories * 1.2
  })
  
  if (mainRecipe) {
    selected.push(mainRecipe)
    currentCalories += (mainRecipe.calories || 0)
  } else if (scoredRecipes.length > 0) {
    selected.push(scoredRecipes[0])
    currentCalories += (scoredRecipes[0].calories || 0)
  }
  
  // Se ainda faltar muitas calorias, tenta adicionar um acompanhamento
  if (currentCalories < targetCalories * 0.7) {
    const remaining = targetCalories - currentCalories
    const sideDish = scoredRecipes.find(r => {
      if (selected.some(s => s.id === r.id)) return false // Evita duplicatas
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
