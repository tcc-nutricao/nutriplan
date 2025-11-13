import { GoogleGenerativeAI } from '@google/generative-ai'
import { AppError } from '../exceptions/AppError.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Serviço de IA usando Google Gemini para gerar recomendações nutricionais
 */
export const GeminiService = {
  
  /**
   * Gera recomendações de receitas baseado no perfil nutricional
   */
  async generateRecipeRecommendations(userProfile) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
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

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
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

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
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

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const prompt = `
Como nutricionista especializado e experiente, responda a pergunta: "${question}"

${patientContext ? `Contexto do paciente: ${JSON.stringify(patientContext)}` : ''}

Forneça uma resposta profissional, prática e baseada em evidências científicas.
Responda em português de forma clara e acessível.
Seja didático e inclua dicas práticas quando relevante.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      
      return {
        answer: response.text(),
        source: 'Google Gemini'
      }

    } catch (error) {
      console.error('Erro no chat nutricional (Gemini):', error)
      throw new AppError({ message: 'Falha no chat nutricional.' })
    }
  }
}