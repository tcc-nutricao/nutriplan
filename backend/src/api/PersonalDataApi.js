import { PersonalDataService } from '../services/PersonalDataService.js'
import { updatePersonalDataSchema, validatePersonalData } from '../dtos/personalData/UpdatePersonalDataDto.js'

export const getPersonalData = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await PersonalDataService.getPersonalData(userId)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Dados pessoais não encontrados'
      })
    }

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Erro ao buscar dados pessoais:', error)
    return res.status(500).json({
      success: false,
      field: error.field || null,
      message: 'Erro ao buscar dados pessoais'
    })
  }
}

export const updatePersonalData = async (req, res) => {
  try {
    const userId = req.user.id 
    console.log('ID do usuário para atualização de dados pessoais:', userId)
    
    const validatedData = validatePersonalData(req.body)

    const result = await PersonalDataService.updatePersonalData(userId, validatedData)

    return res.status(200).json({
      success: true,
      message: 'Dados pessoais atualizados com sucesso',
      data: result
    })
  } catch (error) {
    console.error('Erro ao atualizar dados pessoais:', error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors
      })
    }

    return res.status(400).json({
      success: false,
      field: error.field || null,
      message: error.message || 'Erro interno do servidor'
    });
  }
}