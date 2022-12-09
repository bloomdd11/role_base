const login = async (req, res) => {
  return res.json({ return: true, msg: 'login' })
}
const signup = async (req, res) => {
  return res.json({ return: true, msg: 'signup' })
}
module.exports = { login, signup }