const jwt = require('jsonwebtoken')

const createToken = (auth) => {
  return jwt.sign(
    {
      id: auth.id
    },
    process.env.JWT_SECRET
  )
}

module.exports = {
  createToken,
  generateToken(req, res, next) {
    req.token = createToken(req.auth)
    return next()
  },
  sendToken(req, res) {
    res.setHeader('x-auth-token', req.token)
    return res.status(200).send({ token: req.token, user: req.user })
  }
}
