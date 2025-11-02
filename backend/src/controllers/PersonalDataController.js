import { PersonalDataService } from '../services/PersonalDataService.js'
import { validatePersonalData } from '../dtos/PersonalDataDto.js'

export const PersonalDataController = {
  async createPersonalData(req, res) {
    try {
      const userId = req.user.id 
      
      const validatedData = validatePersonalData(req.body)

      const result = await PersonalDataService.updatePersonalData(userId, validatedData)

      return res.status(200).json({
        success: true,
        message: 'Dados pessoais atualizados com sucesso',
        data: result
      })
    } catch (error) {
      console.error('Erro ao criar dados pessoais:', error)
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors
        })
      }

      return res.status(400).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      })
    }
  }
}