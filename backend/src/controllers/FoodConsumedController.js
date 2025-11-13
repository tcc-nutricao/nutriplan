import { FoodConsumedService } from '../services/FoodConsumedService.js'
import { CreateFoodConsumedSchema } from '../dtos/foodConsumed/CreateFoodConsumedDto.js'
import { generateCrudController } from './Controller.js'

const getFoodDiaryStatistics = async (req, res, next) => {
  try {
    let dates = req.query.dates

    if (typeof dates === 'string') {
      try {
        dates = JSON.parse(dates)
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro dates deve ser um array JSON válido. Exemplo: ["2025-10-25"] ou ["2025-10-20","2025-10-25"]'
        })
      }
    }
    
    const userId = req.user.id
    const result = await FoodConsumedService.getFoodDiaryStatistics(dates, userId)
    
    res.status(200).json({
      success: true,
      message: result.message || 'Estatísticas do diário alimentar obtidas com sucesso',
      data: result.data
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas do diário alimentar:', error)
    
    if (error.message.includes('Array de datas')) {
      return res.status(400).json({
        success: false,
        field: error.field || null,
        message: error.message || 'Erro interno do servidor'
      })
    }
    
    next(error)
  }
}

export const FoodConsumedController = {
  ...generateCrudController(
    FoodConsumedService,
    CreateFoodConsumedSchema,
    'Alimento consumido'
  ),
  getFoodDiaryStatistics
}


