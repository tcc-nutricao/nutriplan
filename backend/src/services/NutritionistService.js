import { NutritionistRepository } from '../repositories/NutritionistRepository.js'
import { NutritionistPatientRepository } from '../repositories/NutritionistPatientRepository.js'
import { MealPlanService } from './MealPlanService.js'
import { generateCrudService } from './Service.js'
import { calculateImc, classifyImc } from '../utils/useImc.js'
import { PatientRepository } from '../repositories/PatientRepository.js'
import { AppError } from '../exceptions/AppError.js'

const baseCrudService = generateCrudService(NutritionistRepository)

export const NutritionistService = {
    ...baseCrudService,

    async getPatients(userId) {
        try {
            if (!userId) {
                return { data: [], total: 0, message: 'userId é obrigatório' }
            }

            const nutritionist = await NutritionistRepository.findByUserId(userId)
            if (!nutritionist) {
                return { data: [], total: 0, message: 'Nutricionista não encontrado' }
            }

            const relations = await NutritionistPatientRepository.findByNutritionistId(nutritionist.id)
            if (relations.length === 0) {
                return { data: [], total: 0, message: 'Nenhum paciente encontrado' }
            }

            const result = []
            for (const relation of relations) {
                const patient = relation.patient || {}
                const user = patient.user || {}

                const activeMealPlan = await MealPlanService.getActiveMealPlanForPatient(patient.id)

                let objective = null
                    if (activeMealPlan) {
                        const mainObjective = activeMealPlan?.goal?.goalObjectives?.find(o => o.type === 'MAIN') || null
                            objective = mainObjective?.objective?.name
                                ?? mainObjective?.objective?.description
                                ?? null
                    }

                const weight = patient.weight ?? 0
                const height = patient.height ?? 0

                const imc = calculateImc(weight, height)
                const imcDefinition = classifyImc(imc)

                result.push({
                    name: user.name || 'Paciente desconhecido',
                    objective,
                    imc,
                    imcDefinition,
                    lastUpdated: patient.updated_at ?? patient.created_at
                })
            }

            return result
        } catch (error) {
            console.error('Erro geral ao buscar pacientes do nutricionista:', error)
            return { data: [], total: 0, message: 'Erro ao buscar pacientes' }
        }
    },

    async getPatientInfo(patientId) {
        try {
            if (!patientId) {
                return { data: [], total: 0, message: 'patientId é obrigatório' }
            }

            const patient = await PatientRepository.findById(patientId)
            if (!patient) {
                return { data: [], total: 0, message: 'Paciente não encontrado' }
            }

            const activeMealPlan = await MealPlanService.getActiveMealPlanForPatient(patientId)
            const mainObjective = activeMealPlan?.goal?.goalObjectives?.find(o => o.type === 'MAIN')
            const restrictions = activeMealPlan?.mealPlanDietaryRestrictions?.map(mpRestriction => mpRestriction.dietaryRestriction) || []

            const recipes = activeMealPlan?.mealPlanMeals
                .flatMap(mpm => (mpm.foodConsumed || []))
                .map(foodConsumed => foodConsumed.recipe)
                .filter(recipe => recipe != null)

            const data = {
                name: patient.user?.name || 'Paciente desconhecido',
                age: patient.age,
                gender: patient.gender,
                height: patient.height,
                weight: patient.weight,
                imc: calculateImc(patient.weight || 0, patient.height || 0),
                imcDefinition: classifyImc(calculateImc(patient.weight || 0, patient.height || 0)),
                lastUpdated: patient.updated_at || patient.created_at,
                mealPlan: {
                    objective: mainObjective?.objective?.name || null,
                    restrictions,
                    preferences: activeMealPlan?.dietaryPreferences || [],
                },
                recipes
            }

            return { data, total: 1 }
        } catch (error) {
            console.error('Erro ao buscar informações do paciente:', error)
            throw error
        }
    },

    async generateInviteCode(userId) {
        try {
            const nutritionist = await NutritionistRepository.findByUserId(userId)
            if (!nutritionist) {
                throw new AppError({ message: 'Nutricionista não encontrado', statusCode: 404 })
            }

            const code = Math.random().toString(36).substring(2, 6).toUpperCase();
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

            await NutritionistRepository.updateInviteCode(nutritionist.id, code, expiresAt);

            return { code, expiresAt };
        } catch (error) {
            throw error;
        }
    },

    async getInviteCode(userId) {
        try {
            const nutritionist = await NutritionistRepository.findByUserId(userId)
            if (!nutritionist) {
                throw new AppError({ message: 'Nutricionista não encontrado', statusCode: 404 })
            }

            if (nutritionist.invite_code && nutritionist.invite_code_expires_at) {
                if (new Date() < new Date(nutritionist.invite_code_expires_at)) {
                     return { 
                        code: nutritionist.invite_code, 
                        expiresAt: nutritionist.invite_code_expires_at 
                    };
                }
            }

            // If no code or expired, generate a new one
            return await this.generateInviteCode(userId);

        } catch (error) {
            throw error;
        }
    },

    async linkPatientByCode(patientId, code) {
        try {
            const nutritionist = await NutritionistRepository.findByInviteCode(code);

            if (!nutritionist) {
                throw new AppError({ message: 'Código inválido', statusCode: 400 });
            }

            if (new Date() > new Date(nutritionist.invite_code_expires_at)) {
                throw new AppError({ message: 'Código expirado', statusCode: 400 });
            }

            // Check if already linked
            const existingLink = await NutritionistPatientRepository.findByNutritionistAndPatientId(nutritionist.id, patientId);
            if (existingLink) {
                 return { message: 'Você já está vinculado a este nutricionista' };
            }

            await NutritionistPatientRepository.create({
                id_nutritionist: nutritionist.id,
                id_patient: patientId
            });
            
            // Update patient's primary nutritionist if not set (optional but recommended)
            const patient = await PatientRepository.findById(patientId);
            if (!patient.id_nutritionist) {
                 await PatientRepository.update(patientId, { id_nutritionist: nutritionist.id });
            }

            return { message: 'Vinculado com sucesso', nutritionistName: nutritionist.user.name };
        } catch (error) {
            throw error;
        }
    }
}
