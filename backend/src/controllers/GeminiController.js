import { GeminiService } from '../services/GeminiService.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { GoalRepository } from '../repositories/GoalRepository.js'
import { HealthDataRepository } from '../repositories/HealthDataRepository.js'

export const GeminiController = {
  
  /**
   * Gera recomendações de receitas para um paciente usando Gemini
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

      const recommendations = await GeminiService.generateRecipeRecommendations(userProfile)
      
      return res.status(200).json({
        success: true,
        data: recommendations,
        patient_id: patientId,
        ai_provider: 'Google Gemini'
      })

    } catch (error) {
      console.error('Erro ao gerar recomendações (Gemini):', error)
      return res.status(500).json({ 
        error: 'Falha ao gerar recomendações',
        message: error.message,
        provider: 'Gemini'
      })
    }
  },

  /**
   * Analisa compatibilidade de um alimento usando Gemini
   */
  async analyzeFood(req, res, next) {
    try {
      const { foodName } = req.params
      const { dietaryRestrictions = [] } = req.body

      const analysis = await GeminiService.analyzeFood(foodName, dietaryRestrictions)
      
      return res.status(200).json({
        success: true,
        food: foodName,
        analysis,
        ai_provider: 'Google Gemini'
      })

    } catch (error) {
      console.error('Erro ao analisar alimento (Gemini):', error)
      return res.status(500).json({ 
        error: 'Falha ao analisar alimento',
        message: error.message,
        provider: 'Gemini'
      })
    }
  },

  /**
   * Gera plano de refeições personalizado usando Gemini
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

      const mealPlan = await GeminiService.generateMealPlan(userProfile, days)
      
      return res.status(200).json({
        success: true,
        data: mealPlan,
        patient_id: patientId,
        generated_at: new Date(),
        ai_provider: 'Google Gemini'
      })

    } catch (error) {
      console.error('Erro ao gerar plano alimentar (Gemini):', error)
      return res.status(500).json({ 
        error: 'Falha ao gerar plano alimentar',
        message: error.message,
        provider: 'Gemini'
      })
    }
  },

  /**
   * Chat livre com a IA Gemini para perguntas nutricionais
   */
  async nutritionChat(req, res, next) {
    try {
      const { question, patientContext = null } = req.body

      if (!question) {
        return res.status(400).json({ error: 'Pergunta é obrigatória' })
      }

      const result = await GeminiService.nutritionChat(question, patientContext)

      return res.status(200).json({
        success: true,
        question,
        answer: result.answer,
        ai_provider: 'Google Gemini',
        timestamp: new Date()
      })

    } catch (error) {
      console.error('Erro no chat nutricional (Gemini):', error)
      return res.status(500).json({ 
        error: 'Falha no chat nutricional',
        message: error.message,
        provider: 'Gemini'
      })
    }
  }
}