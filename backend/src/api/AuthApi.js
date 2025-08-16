import { AuthController } from '../controllers/AuthController.js'
import jwt from 'jsonwebtoken'

export const login = async (req, res, next) => {
  try {
    await AuthController.login(req, res, next)
  } catch (error) {
    next(error)
  }
}

export const validate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' })
  }
}
