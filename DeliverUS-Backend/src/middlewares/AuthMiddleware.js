import passport from 'passport'

//Verifica que el usuario tiene uno de los roles permitidos
//Comprueba que req.user esta definido y que userType esta en la lista de roles
const hasRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).send({ error: 'Not logged in' })
  }
  if (!roles.includes(req.user.userType)) {
    return res.status(403).send({ error: 'Not enough privileges' })
  }
  return next()
}

//Verfica si el usuario está autenticado
const isLoggedIn = (req, res, next) => {
  passport.authenticate('bearer', { session: false })(req, res, next)
}

export { hasRole, isLoggedIn }
