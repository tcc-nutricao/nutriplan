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

export const forgotPassword = async (req, res, next) => {
  try {
    await AuthController.forgotPassword(req, res, next)
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    await AuthController.resetPassword(req, res, next)
  } catch (error) {
    next(error)
  }
}



