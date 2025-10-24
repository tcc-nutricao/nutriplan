import { getImcData } from './useImc.js'

/**
 * Calcula total de dias entre duas datas
 * @param {Date} startDate - Data de início
 * @param {Date} endDate - Data de fim (opcional)
 * @param {number} defaultDays - Valor padrão se não houver end_date
 * @returns {number} - Total de dias
 */
export const calculateTotalDays = (startDate, endDate = null, defaultDays = 30) => {
  if (!endDate) return defaultDays
  return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
}

/**
 * Calcula o progresso baseado no objetivo do paciente
 * @param {number} objectiveId - ID do objetivo (1-5)
 * @param {object} initialData - Dados iniciais { weight, height, date }
 * @param {object} currentData - Dados atuais { weight, height, date }
 * @param {object} targetData - Meta (opcional) { weight, targetWeight, adherence }
 * @param {string} objectiveName - Nome do objetivo vindo do banco
 * @returns {object} - Dados de progresso calculado
 */
export const calculateProgress = (objectiveId, initialData, currentData, targetData = null, objectiveName = '') => {
  const progressCalculators = {
    1: calculateWeightLossProgress,      // Perda de peso
    2: calculateWeightGainProgress,      // Ganho de peso
    3: calculateWeightMaintenanceProgress, // Manutenção de peso
    4: calculateImcReductionProgress,    // Redução de IMC
    5: calculateFoodEducationProgress    // Reeducação alimentar
  }

  const calculator = progressCalculators[objectiveId]
  
  if (!calculator) {
    throw new Error(`Objetivo com ID ${objectiveId} não é suportado`)
  }
  
  return calculator(initialData, currentData, targetData, objectiveName)
}

/**
 * Calcula progresso para perda de peso
 */
const calculateWeightLossProgress = (initial, current, target, objectiveName) => {
  const targetWeight = target?.targetWeight
  const totalToLose = initial.weight - targetWeight
  const actualLoss = initial.weight - current.weight
  const percentage = totalToLose > 0 ? Math.min((actualLoss / totalToLose) * 100, 100) : 0
  
  return {
    metaAchieved: Math.max(percentage, 0),
    weightDifference: -(actualLoss), // negativo para perda
    targetWeight: target?.targetWeight,
    objective: objectiveName
  }
}

/**
 * Calcula progresso para ganho de peso
 */
const calculateWeightGainProgress = (initial, current, target, objectiveName) => {
  const targetWeight = target?.targetWeight
  const totalToGain = targetWeight - initial.weight
  const actualGain = current.weight - initial.weight
  const percentage = totalToGain > 0 ? Math.min((actualGain / totalToGain) * 100, 100) : 0
  
  return {
    metaAchieved: Math.max(percentage, 0),
    weightDifference: actualGain, 
    targetWeight: target?.targetWeight,
    objective: objectiveName
  }
}

/**
 * Calcula progresso para manutenção de peso
 */
const calculateWeightMaintenanceProgress = (initial, current, target, objectiveName) => {
  const tolerance = 2 // kg de tolerância para manutenção
  const initialWeight = target?.targetWeight || initial.weight
  const difference = Math.abs(current.weight - initialWeight)
  const isWithinRange = difference <= tolerance
  const percentage = isWithinRange ? 100 : Math.max(100 - (difference * 25), 0) // penaliza 25% por kg fora da faixa
  
  return {
    metaAchieved: Math.max(percentage, 0),
    weightDifference: current.weight - initial.weight,
    targetWeight: target?.targetWeight,
    objective: objectiveName
  }
}

/**
 * Calcula progresso para redução de IMC
 */
const calculateImcReductionProgress = (initial, current, target, objectiveName) => {
  const initialImc = getImcData(initial.weight, initial.height).imc
  const currentImc = getImcData(current.weight, current.height).imc
  const targetImc = target?.targetImc || 24.9 // IMC normal máximo
  
  const totalImcToReduce = initialImc - targetImc
  const actualImcReduction = initialImc - currentImc
  const percentage = totalImcToReduce > 0 ? Math.min((actualImcReduction / totalImcToReduce) * 100, 100) : 0
  
  return {
    metaAchieved: Math.max(percentage, 0),
    weightDifference: current.weight - initial.weight,
    targetWeight: target?.targetWeight,
    objective: objectiveName
  }
}

/**
 * Calcula progresso para reeducação alimentar
 */
const calculateFoodEducationProgress = (initial, current, target, objectiveName) => {
  // Baseado na adesão ao plano alimentar (dados que você já tem)
  const daysFollowed = target?.daysFollowed || 0
  const totalDays = target?.totalDays || 30
  
  const adherencePercentage = totalDays > 0 ? (daysFollowed / totalDays) * 100 : 0
  const weightStability = Math.abs(current.weight - initial.weight) <= 1 // peso estável indica boa reeducação
  const consistencyBonus = weightStability ? 20 : 0
  
  const finalPercentage = Math.min(adherencePercentage + consistencyBonus, 100)
  
  return {
    metaAchieved: Math.max(finalPercentage, 0),
    weightDifference: current.weight - initial.weight,
    targetWeight: target?.targetWeight,
    objective: objectiveName
  }
}

/**
 * Formata dados de progresso para resposta da API
 */
export const formatProgressResponse = (progressData, patientData) => {
  return {
    objective: progressData.objective,
    initialWeight: patientData.initialWeight,
    actualWeight: patientData.actualWeight,
    targetWeight: progressData.targetWeight,
    imc: patientData.currentImc,
    lastUpdate: patientData.lastUpdate,
    progress: patientData.weightHistory,
    metaAchieved: progressData.metaAchieved,
    weightDifference: progressData.weightDifference
  }
}