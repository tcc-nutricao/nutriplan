import jwt from 'jsonwebtoken'

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
      console.log(err)
        res.clearCookie('token');
        res.status(401).json({ message: 'Token inválido' })
    }
}