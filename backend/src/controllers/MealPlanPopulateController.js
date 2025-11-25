import { MealPlanPopulateService } from '../services/MealPlanPopulateService.js'

const populateMealPlan = async (req, res) => {
  try {
    const { id } = req.params
    const mealPlanId = parseInt(id, 10)

    if (isNaN(mealPlanId)) {
      return res.status(400).json({
        success: false,
        message: 'ID do plano alimentar inválido'
      })
    }

    const result = await MealPlanPopulateService.populateMealPlan(mealPlanId)

    return res.status(200).json({
      success: true,
      message: 'Plano alimentar populado com sucesso',
      data: result
    })

  } catch (error) {
    console.error('Erro ao popular plano alimentar:', error)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Erro ao popular plano alimentar'
    })
  }
}

export const MealPlanPopulateController = {
  populateMealPlan
}
