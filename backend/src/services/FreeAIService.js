// Alternativa gratuita usando Hugging Face
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY) // API gratuita

export const FreeAIService = {
  async generateRecipeRecommendations(userProfile) {
    try {
      const prompt = `Crie 3 receitas saudáveis para: ${JSON.stringify(userProfile)}`
      
      const result = await hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7
        }
      })
      
      return result.generated_text
      
    } catch (error) {
      throw new Error('Erro na geração gratuita')
    }
  }
}

// Para usar: npm install @huggingface/inference