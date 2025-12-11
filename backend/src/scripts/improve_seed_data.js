
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipesPath = path.join(__dirname, '../assets/recipes.json');
const preferencesPath = path.join(__dirname, '../assets/preferences.json');
const recipePreferencesPath = path.join(__dirname, '../assets/recipe_preferences.json');

const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));
const preferences = JSON.parse(fs.readFileSync(preferencesPath, 'utf-8'));

const unhealthyKeywords = [
  'Batata Frita', 'Linguiça', 'Salsicha', 'Coca-Cola', 'Brigadeiro', 
  'Bolo', 'Pudim', 'Mousse', 'Gelatina', 'Sorvete', 'Milkshake', 
  'Refrigerante', 'Frito', 'Frita', 'Bacon', 'Presunto', 'Açúcar', 
  'Leite Condensado', 'Creme de Leite', 'Manteiga', 'Queijo', 
  'Pizza', 'Lasanha', 'Hambúrguer', 'Hot Dog', 'Cachorro Quente',
  'Pastel', 'Coxinha', 'Rissoles', 'Empada', 'Torta', 'Quindim',
  'Beijinho', 'Cajuzinho', 'Churros', 'Donut', 'Sonho', 'Rabanada'
];

const excludeNames = [
  'Batata Frita Caseira', 'Linguiça Frita', 'Brigadeiro', 'Mousse de Maracujá', 
  'Caipirinha', 'Gelatina Colorida', 'Bolo de Caneca', 'Coca-Cola Limonada', 
  'Pudim de Gelatina', 'Geladinho de Suco', 'Bolo de Areia', 'Bolo de Coco Simples', 
  'Salsicha na Airfryer', 'Salsicha no Molho', 'Mousse de Limão Rápida', 
  'Pipoca Doce Simples', 'Torrada com Geleia', 'Pão com Creme de Avelã',
  'Salsicha Cozida', 'Macarrão com Queijo', 'Pão de alho'
];

const healthyRecipes = recipes.filter(r => !excludeNames.includes(r.name));

console.log(`Original recipes: ${recipes.length}`);
console.log(`Healthy recipes: ${healthyRecipes.length}`);

function getPreferencesForRecipe(recipe) {
  const prep = recipe.preparation_method.toLowerCase();
  const name = recipe.name.toLowerCase();
  const text = `${name} ${prep}`;
  
  const prefs = [];

  const has = (regex) => regex.test(text);

  const hasMeat = has(/carne|frango|peixe|bacon|presunto|linguiça|salsicha|atum|sardinha|bife|iscas|bolonhesa/);
  const hasFish = has(/peixe|atum|sardinha|camarão|frutos do mar|salmão/);
  const hasDairy = has(/leite|queijo|manteiga|iogurte|requeijão|creme de leite|coalhada|skyr/);
  const hasEgg = has(/ovo|clara|gema/);
  const hasGluten = has(/farinha de trigo|pão|macarrão|biscoito|torrada|lasanha|pizza|bolo|aveia/); 
  const hasSugar = has(/açúcar|leite condensado|\bmel\b|chocolate|geleia|\bdoce\b|mousse|gelatina|\bcaramelo\b/);
  const hasNuts = has(/nozes|castanha|amendoim|avelã|amêndoa/);

  if (!hasMeat && !hasFish) {
    prefs.push('Vegetariano');
    if (!hasDairy && !hasEgg && !has(/\bmel\b/)) {
      prefs.push('Vegano');
    }
  }

  if (!hasGluten) prefs.push('Sem Glúten');
  if (!hasDairy) prefs.push('Sem lactose');
  if (!hasSugar) prefs.push('Sem açúcar');
  if (!hasFish) prefs.push('Sem peixe');
  if (!hasNuts) prefs.push('Sem nozes');

  if (recipe.preparation_time <= 15) prefs.push('Fácil');
  
  // Logic for Doce (Sweet)
  // Exclude savory items that might accidentally key off sugar (like tomato sauce) or "batata doce" (which matches "doce" but is essentially savory in main dishes, though sweet-ish)
  // Also excluding "Molho de tomate" explicitly if it contains "açúcar".
  const isSavoryExclusion = has(/molho de tomate|sopa de cebola|omelete|molho de mostarda/);
  
  if ((hasSugar || has(/fruta|banana|maçã|manga|abacaxi|uva|morango|laranja/)) && !isSavoryExclusion) {
    // Determine if it is likely a main savory dish despite having "doce" or "açúcar"
    // For now, we trust the exclusions and the stricter regex.
    prefs.push('Doce');
  } 
  
  if (has(/salada|legumes|verdura|couve|espinafre|brócolis|cenoura|abobrinha|pepino/)) {
      prefs.push('Emagrecer');
      prefs.push('Antioxidante');
      prefs.push('Intestino');
  }
  
  if (has(/frango|ovo|carne|peixe|atun|sardinha|skyr|iogurte/)) {
      prefs.push('Ganho de músculo');
      prefs.push('Energia');
  }

  if (has(/aveia|integral|fibra|chia|linhaça/)) {
      prefs.push('Intestino');
      prefs.push('Colesterol');
  }

  return [...new Set(prefs)]; 
}

const newRecipePreferences = [];

healthyRecipes.forEach(recipe => {
  const recipePrefs = getPreferencesForRecipe(recipe);
  
  recipePrefs.forEach(prefName => {
    const dbPref = preferences.find(p => p.name === prefName);
    if (dbPref) {
      newRecipePreferences.push({
        recipe_name: recipe.name,
        preference_name: prefName
      });
    }
  });
});

fs.writeFileSync(recipesPath, JSON.stringify(healthyRecipes, null, 2));
fs.writeFileSync(recipePreferencesPath, JSON.stringify(newRecipePreferences, null, 2));

console.log(`Generated ${newRecipePreferences.length} recipe preferences.`);
