const jwt = require('jsonwebtoken')
const CustomAPIError = require('./custom-api')

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new CustomAPIError('no authHeader', 402)
  }

  let payload = jwt.verify(token, 'JWTSECRET')
  req.user = payload
  next()
}