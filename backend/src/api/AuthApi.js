import { AuthController } from '../controllers/AuthController.js'
import jwt from 'jsonwebtoken'

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

export const authenticate = (req, res, next) => {
  const token = req.cookies.token

   if (!token) {
    return res.status(401).json({ message: "Token não fornecido" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' })
  }
}
