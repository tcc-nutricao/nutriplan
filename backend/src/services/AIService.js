import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Serviço de IA para gerar recomendações nutricionais
 */
export const AIService = {
  
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

IMPORTANTE: Retorne apenas o JSON, sem texto adicional.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Mais barato que o GPT-4
        messages: [
          {
            role: "system",
            content: "Você é um nutricionista especializado em criar receitas personalizadas. Sempre responda em JSON válido conforme solicitado."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })

      const response = completion.choices[0].message.content
      return JSON.parse(response)

    } catch (error) {
      console.error('Erro ao gerar recomendações de receitas:', error)
      throw new Error('Falha ao gerar recomendações. Tente novamente.')
    }
  },

  /**
   * Analisa compatibilidade de alimentos com restrições
   */
  async analyzeFood(foodName, dietaryRestrictions = []) {
    try {
      const prompt = `
Analise se o alimento "${foodName}" é compatível com estas restrições: ${dietaryRestrictions.join(', ')}.

Responda em JSON:
{
  "compatible": true/false,
  "warnings": ["Aviso 1", "Aviso 2"],
  "alternatives": ["Alternativa 1", "Alternativa 2"],
  "nutritional_info": "Informação nutricional relevante"
}
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em nutrição e alergias alimentares."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      })

      return JSON.parse(completion.choices[0].message.content)

    } catch (error) {
      console.error('Erro ao analisar alimento:', error)
      throw new Error('Falha ao analisar alimento.')
    }
  },

  /**
   * Gera plano de refeições personalizado
   */
  async generateMealPlan(userProfile, days = 7) {
    try {
      const prompt = `
Crie um plano alimentar de ${days} dias para:

**PERFIL:**
- Objetivos: ${userProfile.goals?.map(g => g.description).join(', ') || 'Não especificado'}
- Restrições: ${userProfile.dietaryRestrictions?.join(', ') || 'Nenhuma'}
- IMC: ${userProfile.healthData?.bmi || 'N/A'}

**FORMATO JSON:**
{
  "meal_plan": {
    "days": [
      {
        "day": 1,
        "date": "2024-XX-XX",
        "meals": [
          {
            "type": "café da manhã",
            "time": "08:00",
            "recipe": "Nome da receita",
            "calories": 350,
            "quick_ingredients": ["ing1", "ing2"]
          }
        ],
        "daily_totals": {
          "calories": 1800,
          "protein": "120g",
          "carbs": "180g",
          "fat": "60g"
        }
      }
    ]
  },
  "weekly_summary": "Resumo dos benefícios do plano"
}
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: "Você é um nutricionista criando planos alimentares personalizados."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.6,
      })

      return JSON.parse(completion.choices[0].message.content)

    } catch (error) {
      console.error('Erro ao gerar plano alimentar:', error)
      throw new Error('Falha ao gerar plano alimentar.')
    }
  }
}