
import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

async function generateFoods() {
    console.log(geminiUrl)
  const prompt = `
Gere 20 alimentos em formato JSON, cada um com os campos:
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
  let foods;
  try {
    foods = JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[.*\]/s);
    foods = match ? JSON.parse(match[0]) : [];
  }

  fs.writeFileSync('foods.json', JSON.stringify(foods, null, 2));
  console.log('Arquivo foods.json gerado com', foods.length, 'alimentos!');
}

async function generateRecipes() {
  const prompt = `
Gere 10 receitas em formato JSON, cada uma com os campos:
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
  let recipes;
  try {
    recipes = JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[.*\]/s);
    recipes = match ? JSON.parse(match[0]) : [];
  }

  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
  console.log('Arquivo recipes.json gerado com', recipes.length, 'receitas!');
}

async function generateMealPlans() {
  const prompt = `
Gere 5 planos de refeição em formato JSON, cada um com os campos:
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
  let mealPlans;
  try {
    mealPlans = JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[.*\]/s);
    mealPlans = match ? JSON.parse(match[0]) : [];
  }

  fs.writeFileSync('mealplans.json', JSON.stringify(mealPlans, null, 2));
  console.log('Arquivo mealplans.json gerado com', mealPlans.length, 'planos de refeição!');
}

export { generateFoods, generateRecipes, generateMealPlans };
