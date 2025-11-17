import axios from 'axios'
import { AppError } from '../exceptions/AppError.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

/**
 * Serviço de IA usando Google Gemini para gerar recomendações nutricionais
 */
export const GeminiService = {
  
  /**
   * Gera recomendações de receitas baseado no perfil nutricional
   */
  async generateRecipeRecommendations(userProfile) {
    try {
      const { 
        goals, 
        dietaryRestrictions = [], 
        preferences = [], 
        healthData = {},
        currentMealPlan = null 
      } = userProfile

      const prompt = `
Como nutricionista especializado, preciso de 3 recomendações de receitas personalizadas:

**PERFIL DO PACIENTE:**
- Objetivos: ${goals?.map(g => g.description).join(', ') || 'Não especificado'}
- Restrições alimentares: ${dietaryRestrictions.join(', ') || 'Nenhuma'}
- Preferências: ${preferences.join(', ') || 'Nenhuma específica'}
- Dados de saúde: IMC ${healthData.bmi || 'N/A'}, Peso ${healthData.weight || 'N/A'}kg
- Plano atual: ${currentMealPlan?.description || 'Nenhum'}

**FORMATO DE RESPOSTA (JSON válido):**
{
  "recipes": [
    {
      "name": "Nome da Receita",
      "description": "Descrição breve e atrativa",
      "category": "café da manhã|almoço|jantar|lanche",
      "prep_time": 30,
      "servings": 2,
      "calories_per_serving": 350,
      "macros": {
        "protein": "25g",
        "carbs": "40g", 
        "fat": "12g",
        "fiber": "8g"
      },
      "ingredients": [
        "Ingredient 1 - quantidade",
        "Ingredient 2 - quantidade"
      ],
      "instructions": [
        "Passo 1 detalhado",
        "Passo 2 detalhado"
      ],
      "nutritional_benefits": "Por que esta receita é ideal para os objetivos",
      "tips": "Dicas de preparo e variações"
    }
  ],
  "general_recommendations": "Recomendações gerais baseadas no perfil"
}

IMPORTANTE: Retorne apenas o JSON válido, sem texto adicional antes ou depois.
      `

      const response = await axios.post(geminiUrl, {
        contents: [{ parts: [{ text: prompt }] }]
      })
      
      const text = response.data.candidates[0].content.parts[0].text
      
      // Limpa o texto para garantir que é JSON válido
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
      
      return JSON.parse(cleanedText)

    } catch (error) {
      console.error('Erro ao gerar recomendações de receitas (Gemini):', error)
      throw new AppError({ message: 'Falha ao gerar recomendações. Tente novamente.' })
    }
  },

  /**
   * Analisa compatibilidade de alimentos com restrições
   */
  async analyzeFood(foodName, dietaryRestrictions = []) {
    try {
      const prompt = `
Como especialista em nutrição e alergias alimentares, analise se o alimento "${foodName}" é compatível com estas restrições: ${dietaryRestrictions.join(', ')}.

Responda APENAS em JSON válido:
{
  "compatible": true ou false,
  "warnings": ["Aviso 1", "Aviso 2"],
  "alternatives": ["Alternativa 1", "Alternativa 2"],
  "nutritional_info": "Informação nutricional relevante"
}

Não adicione texto antes ou depois do JSON.
      `

      const response = await axios.post(geminiUrl, {
        contents: [{ parts: [{ text: prompt }] }]
      })
      
      const text = response.data.candidates[0].content.parts[0].text
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
      
      return JSON.parse(cleanedText)

    } catch (error) {
      console.error('Erro ao analisar alimento (Gemini):', error)
      throw new AppError({ message: 'Falha ao analisar alimento.' })
    }
  },

  /**
   * Gera plano de refeições personalizado
   */
  async generateMealPlan(userProfile, days = 7) {
    try {
      const prompt = `
Como nutricionista especializado, crie um plano alimentar de ${days} dias para:

**PERFIL:**
- Objetivos: ${userProfile.goals?.map(g => g.description).join(', ') || 'Não especificado'}
- Restrições: ${userProfile.dietaryRestrictions?.join(', ') || 'Nenhuma'}
- IMC: ${userProfile.healthData?.bmi || 'N/A'}
- Peso: ${userProfile.healthData?.weight || 'N/A'}kg

**FORMATO JSON (retorne apenas o JSON):**
{
  "meal_plan": {
    "days": [
      {
        "day": 1,
        "date": "2025-09-26",
        "meals": [
          {
            "type": "café da manhã",
            "time": "08:00",
            "recipe": "Nome da receita",
            "calories": 350,
            "quick_ingredients": ["ing1", "ing2"]
          },
          {
            "type": "almoço",
            "time": "12:00", 
            "recipe": "Nome da receita",
            "calories": 450,
            "quick_ingredients": ["ing1", "ing2"]
          },
          {
            "type": "jantar",
            "time": "19:00",
            "recipe": "Nome da receita", 
            "calories": 400,
            "quick_ingredients": ["ing1", "ing2"]
          }
        ],
        "daily_totals": {
          "calories": 1200,
          "protein": "80g",
          "carbs": "120g",
          "fat": "40g"
        }
      }
    ]
  },
  "weekly_summary": "Resumo dos benefícios do plano"
}

Crie ${days} dias completos. Retorne APENAS o JSON.
      `

      const response = await axios.post(geminiUrl, {
        contents: [{ parts: [{ text: prompt }] }]
      })
      
      const text = response.data.candidates[0].content.parts[0].text
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
      
      return JSON.parse(cleanedText)

    } catch (error) {
      console.error('Erro ao gerar plano alimentar (Gemini):', error)
      throw new AppError({ message: 'Falha ao gerar plano alimentar.' })
    }
  },

  /**
   * Chat livre com a IA para perguntas nutricionais
   */
  async nutritionChat(question, patientContext = null) {
    try {
      const prompt = `
Como nutricionista especializado e experiente, responda a pergunta: "${question}"

${patientContext ? `Contexto do paciente: ${JSON.stringify(patientContext)}` : ''}

Forneça uma resposta profissional, prática e baseada em evidências científicas.
Responda em português de forma clara e acessível.
Seja didático e inclua dicas práticas quando relevante.
      `

      const response = await axios.post(geminiUrl, {
        contents: [{ parts: [{ text: prompt }] }]
      })
      
      const text = response.data.candidates[0].content.parts[0].text
      
      return {
        answer: text,
        source: 'Google Gemini'
      }

    } catch (error) {
      console.error('Erro no chat nutricional (Gemini):', error)
      throw new AppError({ message: 'Falha no chat nutricional.' })
    }
  },

  /**
   * Gera 10 planos alimentares completos com refeições e receitas
   */
  async generateCompleteMealPlans(userProfile, availableRecipes = [], count = 10) {
    try {
      const { 
        height, 
        weight, 
        bmi,
        gender, 
        age,
        goals = [], 
        dietaryRestrictions = []
      } = userProfile

      // Calcular TMB
      let tmb;
      if (gender === 'FEM') {
        tmb = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
      } else {
        tmb = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
      }
      
      const caloriasSugeridas = Math.round(tmb * 1.4);

      // Lista de receitas disponíveis
      const recipesList = availableRecipes.length > 0 
        ? availableRecipes.map(r => `ID ${r.id}: ${r.name}`).join(', ')
        : 'Receitas genéricas';

      const prompt = `
Como nutricionista, crie ${count} planos alimentares COMPLETOS e VARIADOS para:

**PERFIL:**
- Idade: ${age} anos, Sexo: ${gender === 'FEM' ? 'Feminino' : 'Masculino'}
- Altura: ${height}cm, Peso: ${weight}kg, IMC: ${bmi?.toFixed(1)}
- Calorias base: ${caloriasSugeridas} kcal
- Objetivos: ${goals.map(g => g.name).join(', ') || 'Alimentação saudável'}
- Restrições: ${dietaryRestrictions.join(', ') || 'Nenhuma'}

**RECEITAS DISPONÍVEIS NO SISTEMA:**
${recipesList}

**REFEIÇÕES DISPONÍVEIS (IDs fixos):**
1. Café da manhã
2. Lanche da manhã
3. Almoço
4. Café da tarde
5. Janta
6. Lanche da noite

**DIAS DA SEMANA:**
MON, TUE, WED, THU, FRI, SAT, SUN

**CRIAR ${count} PLANOS DIFERENTES:**
- Varie calorias: ${caloriasSugeridas - 300} a ${caloriasSugeridas + 300} kcal
- Varie abordagens: mediterrâneo, low carb, alta proteína, vegetariano, equilibrado, etc
- Cada plano deve ter 7 dias completos
- Cada dia deve ter as 6 refeições
- Use IDs de receitas reais quando disponível, senão use receitas genéricas

**RETORNE APENAS ESTE JSON:**
{
  "plans": [
    {
      "name": "Plano Mediterrâneo Energético",
      "description": "Foco em gorduras boas e peixes",
      "calories": ${caloriasSugeridas},
      "days": [
        {
          "day": "MON",
          "meals": [
            {
              "id_meal": 1,
              "time": "07:30",
              "recipe_ids": [1, 2]
            },
            {
              "id_meal": 2,
              "time": "10:00",
              "recipe_ids": [3]
            },
            {
              "id_meal": 3,
              "time": "12:30",
              "recipe_ids": [4, 5]
            },
            {
              "id_meal": 4,
              "time": "15:30",
              "recipe_ids": [6]
            },
            {
              "id_meal": 5,
              "time": "19:00",
              "recipe_ids": [7, 8]
            },
            {
              "id_meal": 6,
              "time": "21:30",
              "recipe_ids": [9]
            }
          ]
        }
      ]
    }
  ]
}

IMPORTANTE:
- Crie ${count} objetos no array "plans"
- Cada plano deve ter 7 dias (MON a SUN)
- Cada dia deve ter 6 meals (id_meal de 1 a 6)
- Use recipe_ids válidos (${availableRecipes.length > 0 ? 'dos disponíveis' : 'genere IDs de 1 a 50'})
- Retorne APENAS o JSON válido, sem markdown
      `

      const response = await axios.post(geminiUrl, {
        contents: [{ parts: [{ text: prompt }] }]
      })
      
      const text = response.data.candidates[0].content.parts[0].text
      
      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      
      const parsedData = JSON.parse(cleanedText)
      
      if (!parsedData.plans || !Array.isArray(parsedData.plans)) {
        throw new Error('Formato inválido da IA')
      }

      return parsedData

    } catch (error) {
      console.error('Erro ao gerar planos completos (Gemini):', error)
      throw new AppError({ 
        message: 'Falha ao gerar planos completos com IA.',
        statusCode: 500 
      })
    }
  }
}