import { AIService } from '../services/AIService.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { GoalRepository } from '../repositories/GoalRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const AIController = {
  
  /**
   * Gera recomendações de receitas para um paciente
   */
  async generateRecipeRecommendations(req, res, next) {
    try {
      const { patientId } = req.params
      const { preferences = [], additionalInfo = '' } = req.body

      // Busca dados completos do paciente
      const patient = await PatientRepository.findById(patientId)
      if (!patient) {
        return res.status(404).json({ error: 'Paciente não encontrado' })
      }

      // Busca objetivos do paciente
      const goals = await GoalRepository.search({ 
        filters: [{ field: 'id_patient', value: patientId }] 
      })

      // Busca dados de saúde
      const healthData = await HealthDataRepository.search({ 
        filters: [{ field: 'id_patient', value: patientId }],
        limit: 1,
        order: 'desc'
      })

      const userProfile = {
        patient,
        goals: goals.data || [],
        dietaryRestrictions: [], // Você pode adicionar lógica para buscar restrições
        preferences,
        healthData: healthData.data?.[0] || {},
        additionalInfo
      }

      const recommendations = await AIService.generateRecipeRecommendations(userProfile)
      
      return res.status(200).json({
        success: true,
        data: recommendations,
        patient_id: patientId
      })

    } catch (error) {
      console.error('Erro ao gerar recomendações:', error)
      return res.status(500).json({ 
        error: 'Falha ao gerar recomendações',
        message: error.message
      })
    }
  },

  /**
   * Analisa compatibilidade de um alimento
   */
  async analyzeFood(req, res, next) {
    try {
      const { foodName } = req.params
      const { dietaryRestrictions = [] } = req.body

      const analysis = await AIService.analyzeFood(foodName, dietaryRestrictions)
      
      return res.status(200).json({
        success: true,
        food: foodName,
        analysis
      })

    } catch (error) {
      console.error('Erro ao analisar alimento:', error)
      return res.status(500).json({ 
        error: 'Falha ao analisar alimento',
        message: error.message
      })
    }
  },

  /**
   * Gera plano de refeições personalizado
   */
  async generateMealPlan(req, res, next) {
    try {
      const { patientId } = req.params
      const { days = 7, startDate } = req.body

      // Busca dados do paciente (similar ao método anterior)
      const patient = await PatientRepository.findById(patientId)
      if (!patient) {
        return res.status(404).json({ error: 'Paciente não encontrado' })
      }

      const goals = await GoalRepository.search({ 
        filters: [{ field: 'id_patient', value: patientId }] 
      })

      const healthData = await HealthDataRepository.search({ 
        filters: [{ field: 'id_patient', value: patientId }],
        limit: 1,
        order: 'desc'
      })

      const userProfile = {
        patient,
        goals: goals.data || [],
        dietaryRestrictions: [],
        healthData: healthData.data?.[0] || {}
      }

      const mealPlan = await AIService.generateMealPlan(userProfile, days)
      
      return res.status(200).json({
        success: true,
        data: mealPlan,
        patient_id: patientId,
        generated_at: new Date()
      })

    } catch (error) {
      console.error('Erro ao gerar plano alimentar:', error)
      return res.status(500).json({ 
        error: 'Falha ao gerar plano alimentar',
        message: error.message
      })
    }
  },

  /**
   * Chat livre com a IA para perguntas nutricionais
   */
  async nutritionChat(req, res, next) {
    try {
      const { question, patientContext = null } = req.body

      if (!question) {
        return res.status(400).json({ error: 'Pergunta é obrigatória' })
      }

      const prompt = `
Como nutricionista especializado, responda a pergunta: "${question}"

${patientContext ? `Contexto do paciente: ${JSON.stringify(patientContext)}` : ''}

Forneça uma resposta profissional, prática e baseada em evidências científicas.
Responda em português de forma clara e acessível.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um nutricionista experiente e didático. Dê respostas práticas e baseadas em ciência."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      })

      return res.status(200).json({
        success: true,
        question,
        answer: completion.choices[0].message.content,
        timestamp: new Date()
      })

    } catch (error) {
      console.error('Erro no chat nutricional:', error)
      return res.status(500).json({ 
        error: 'Falha no chat nutricional',
        message: error.message
      })
    }
  }
}