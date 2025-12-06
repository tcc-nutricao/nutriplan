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
  },

  async remove(id) {
    try {
      console.log(`Attempting to delete HealthData record: ${id}`);
      const record = await HealthDataRepository.findById(Number(id)); 
      
      if (!record) {
        console.error(`HealthData record ${id} not found.`);
        throw new Error('Registro não encontrado');
      }

      const { id_patient } = record;
      console.log(`Found record for patient ${id_patient}`);

      await baseService.remove(Number(id));
      console.log(`Record ${id} deleted.`);

      if (id_patient) {
        const latestRecord = await HealthDataRepository.findActualByPatientId(id_patient);
        
        if (latestRecord) {
          console.log(`Found latest remaining record for patient ${id_patient}: Record ID ${latestRecord.id}, Weight ${latestRecord.weight}`);
          await PatientRepository.update(id_patient, { 
            weight: latestRecord.weight,
            height: latestRecord.height 
          });
          console.log(`Patient ${id_patient} updated with weight ${latestRecord.weight}`);
        } else {
           console.log(`No remaining records for patient ${id_patient}. Resetting weight to 0.`);
           await PatientRepository.update(id_patient, { 
            weight: 0,
            height: 0 
          });
        }
      }

      return { success: true, message: 'Registro excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir dados de saúde:', error);
      throw error;
    }
  }
}
