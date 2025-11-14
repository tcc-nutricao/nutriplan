export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    console.log('User role:', req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      res.clearCookie('token');
      return res.status(403).json({ 
        message: `Acesso negado.` 
      })
    }

    next()
  }
}