/**
 * Calcula o Índice de Massa Corporal (IMC)
 * @param {number} weight - Peso em quilogramas
 * @param {number} height - Altura em metros
 * @returns {number} - IMC calculado com 2 casas decimais
 */
import { AppError } from '../exceptions/AppError.js'
 
export const calculateImc = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) {
    throw new AppError({ message: 'Peso e altura devem ser valores positivos válidos' })
  }

  const heightInMeters = height > 3 ? height / 100 : height

  const imc = weight / (heightInMeters * heightInMeters)
  return parseFloat(imc.toFixed(2))
}

/**
 * Classifica o IMC de acordo com os padrões da OMS
 * @param {number} imc - Valor do IMC
 * @returns {string} - Classificação do IMC
 */
export const classifyImc = (imc) => {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25) return 'Peso normal'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidade grau I'
  if (imc < 40) return 'Obesidade grau II'
  return 'Obesidade grau III'
}

/**
 * Calcula e retorna o IMC com sua classificação
 * @param {number} weight - Peso em quilogramas
 * @param {number} height - Altura em metros
 * @returns {object} - Objeto com IMC e classificação
 */
export const getImcData = (weight, height) => {
  const imc = calculateImc(weight, height)
  const classification = classifyImc(imc)
  
  return {
    imc,
    classification
  }
}
