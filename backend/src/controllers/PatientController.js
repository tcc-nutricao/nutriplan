import { PatientService } from "../services/PatientService.js";
import { CreatePatientSchema } from "../dtos/patient/CreatePatientDto.js";
import { generateCrudController } from "./Controller.js";
import { PatientRepository } from "../repositories/PatientRepository.js";

// Método para buscar o paciente logado
const getMe = async (req, res) => {
  try {
    console.log("🧩 Token decodificado:", req.user); // 👈 loga o que vem do token
    const userId = req.user?.id;
    console.log("🧩 userId extraído:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const me = await PatientRepository.findByUserId(userId);
    console.log("🧩 Paciente encontrado:", me);

    if (!me) {
      return res.status(404).json({ message: "Paciente não encontrado" });
    }

    return res.status(200).json(me);
  } catch (e) {
    console.error("❌ Erro em getMe:", e);
    return res.status(500).json({ message: "Erro ao buscar perfil" });
  }
};

// Método para progresso do paciente
const getProgress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do paciente é obrigatório",
      });
    }

    const progressData = await PatientService.getProgress(parseInt(id));

    return res.status(200).json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    console.error("Erro ao buscar progresso do paciente:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Erro interno do servidor",
    });
  }
};

export const PatientController = {
  ...generateCrudController(PatientService, CreatePatientSchema, "Paciente"),
  getMe,
  getProgress,
};
