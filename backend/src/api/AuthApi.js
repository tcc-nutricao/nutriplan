import { AuthController } from '../controllers/AuthController.js'

export const login = async (req, res, next) => {
  try {
    await AuthController.login(req, res, next)
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    await AuthController.logout(req, res, next)
  } catch (error) {
    next(error)
  }
}



