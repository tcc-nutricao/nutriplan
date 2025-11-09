
import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// Função auxiliar para delay entre chamadas
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para gerar um lote de alimentos
async function generateFoodBatch(count) {
  const prompt = `
Gere ${count} alimentos em formato JSON, cada um com os campos:
- name (string)
- calories (number)
- protein (number)
- carbs (number)
- fat (number)
- description (string)
- category (string)
Exemplo de resposta: [{"name":"Arroz","calories":130,"protein":2.7,"carbs":28,"fat":0.3,"description":"Cereal básico","category":"Cereal"}, ...]
Apenas o array JSON, sem texto extra.
`;

  const response = await axios.post(
    geminiUrl,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const text = response.data.candidates[0].content.parts[0].text;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : [];
  }
}

// Gera alimentos em lotes com paralelismo controlado
async function generateFoods(total = 1000, batchSize = 50, concurrency = 2) {
  console.log(`Gerando ${total} alimentos em lotes de ${batchSize} com concorrência ${concurrency}...`);
  const batches = Math.ceil(total / batchSize);
  const allFoods = [];
  
  for (let i = 0; i < batches; i += concurrency) {
    const batchPromises = [];
    // Cria grupo de chamadas paralelas (limitado pela concurrency)
    for (let j = 0; j < concurrency && (i + j) < batches; j++) {
      const currentBatch = i + j + 1;
      console.log(`  Iniciando lote ${currentBatch}/${batches}...`);
      batchPromises.push(generateFoodBatch(batchSize));
    }
    // Aguarda o grupo completar
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(foods => allFoods.push(...foods));
    console.log(`  Progresso: ${allFoods.length}/${total} alimentos gerados`);
    // Salva progresso parcial a cada lote
    fs.writeFileSync('foods.json', JSON.stringify(allFoods, null, 2));
    // Delay entre grupos para respeitar rate limit
    if (i + concurrency < batches) {
      await delay(5000);
    }
  }
  console.log(`✓ Arquivo foods.json gerado com ${allFoods.length} alimentos!`);
  return allFoods;
}

// Função para gerar um lote de receitas
async function generateRecipeBatch(count) {
  const prompt = `
Gere ${count} receitas em formato JSON, cada uma com os campos:
- name (string)
- preparation_method (string)
- preparation_time (minutos, number)
- portion (number)
Exemplo de resposta: [{"name":"Salada de Frango","preparation_method":"Misture tudo.","preparation_time":20,"portion":2}, ...]
Apenas o array JSON, sem texto extra.
`;

  const response = await axios.post(
    geminiUrl,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const text = response.data.candidates[0].content.parts[0].text;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : [];
  }
}

// Gera receitas em lotes com paralelismo controlado
async function generateRecipes(total = 1000, batchSize = 50, concurrency = 2) {
  console.log(`Gerando ${total} receitas em lotes de ${batchSize} com concorrência ${concurrency}...`);
  const batches = Math.ceil(total / batchSize);
  const allRecipes = [];
  
  for (let i = 0; i < batches; i += concurrency) {
    const batchPromises = [];
    // Cria grupo de chamadas paralelas (limitado pela concurrency)
    for (let j = 0; j < concurrency && (i + j) < batches; j++) {
      const currentBatch = i + j + 1;
      console.log(`  Iniciando lote ${currentBatch}/${batches}...`);
      batchPromises.push(generateRecipeBatch(batchSize));
    }
    // Aguarda o grupo completar
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(recipes => allRecipes.push(...recipes));
    console.log(`  Progresso: ${allRecipes.length}/${total} receitas geradas`);
    // Salva progresso parcial a cada lote
    fs.writeFileSync('recipes.json', JSON.stringify(allRecipes, null, 2));
    // Delay entre grupos para respeitar rate limit
    if (i + concurrency < batches) {
      await delay(5000);
    }
  }
  console.log(`✓ Arquivo recipes.json gerado com ${allRecipes.length} receitas!`);
  return allRecipes;
}

// Função para gerar um lote de planos de refeição
async function generateMealPlanBatch(count) {
  const prompt = `
Gere ${count} planos de refeição em formato JSON, cada um com os campos:
- calories (number)
- status (string: DRAFT, ACTIVE ou COMPLETED)
- expiration_date (string ISO ex: 2025-12-31T23:59:59Z)
Exemplo de resposta: [{"calories":2000,"status":"ACTIVE","expiration_date":"2025-12-31T23:59:59Z"}, ...]
Apenas o array JSON, sem texto extra.
`;

  const response = await axios.post(
    geminiUrl,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const text = response.data.candidates[0].content.parts[0].text;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : [];
  }
}

// Gera planos de refeição em lotes com paralelismo controlado
async function generateMealPlans(total = 100, batchSize = 20, concurrency = 2) {
  console.log(`Gerando ${total} planos de refeição em lotes de ${batchSize} com concorrência ${concurrency}...`);
  const batches = Math.ceil(total / batchSize);
  const allMealPlans = [];
  
  for (let i = 0; i < batches; i += concurrency) {
    const batchPromises = [];
    // Cria grupo de chamadas paralelas (limitado pela concurrency)
    for (let j = 0; j < concurrency && (i + j) < batches; j++) {
      const currentBatch = i + j + 1;
      console.log(`  Iniciando lote ${currentBatch}/${batches}...`);
      batchPromises.push(generateMealPlanBatch(batchSize));
    }
    // Aguarda o grupo completar
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(plans => allMealPlans.push(...plans));
    console.log(`  Progresso: ${allMealPlans.length}/${total} planos gerados`);
    // Salva progresso parcial a cada lote
    fs.writeFileSync('mealplans.json', JSON.stringify(allMealPlans, null, 2));
    // Delay entre grupos para respeitar rate limit
    if (i + concurrency < batches) {
      await delay(5000);
    }
  }
  console.log(`✓ Arquivo mealplans.json gerado com ${allMealPlans.length} planos de refeição!`);
  return allMealPlans;
}

export { generateFoods, generateRecipes, generateMealPlans };
