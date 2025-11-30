import { HealthDataRepository } from '../repositories/HealthDataRepository.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { generateCrudService } from './Service.js'

const baseService = generateCrudService(HealthDataRepository)

export const HealthDataService = {
  ...baseService,

  async insert(data) {
    try {
      const healthData = await baseService.insert(data)
      
      if (healthData && data.id_patient) {
        const updateData = {}
        if (data.weight) updateData.weight = data.weight
        if (data.height) updateData.height = data.height
        
        if (Object.keys(updateData).length > 0) {
          await PatientRepository.update(data.id_patient, updateData)
        }
      }
      
      return healthData
    } catch (error) {
      console.error('Erro ao criar dados de saúde:', error)
      throw error
    }
  }
}
