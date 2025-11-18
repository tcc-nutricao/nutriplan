import { PersonalDataService } from '../services/PersonalDataService.js'
import { validatePersonalData, updatePersonalDataSchema } from '../dtos/personalData/UpdatePersonalDataDto.js'

const updatePersonalData = async (req, res) => {
  try {
    // console.log('aaaaa');
    
    const userId = req.user.id 
    
    const validatedData = validatePersonalData(req.body)
    
    // Call the service to update personal data
    const result = await PersonalDataService.updatePersonalData(userId, validatedData);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    // Return detailed error response
    return res.status(error.statusCode || 500).json({
      success: false,
      field: error.field || null,
      message: error.message || 'Erro interno do servidor'
    });
  }
}

export const PersonalDataController = {
  ...generateCrudController(
    PersonalDataService,
    updatePersonalDataSchema,
    'Dados Pessoais'
  ),
  updatePersonalData
}