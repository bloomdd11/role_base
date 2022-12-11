const express = require('express')
const router = express.Router()
const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const CustomAPIError = require('../middleware/custom-api')
const User = require('../model/User')

router.post('/signup', [
  body('username').not().isEmpty(),
  body('password').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('invalid value', 400)
  }

  const { username, password } = req.body
  const temp_user = { username: username, password: await bcrpyt.hash(password, 10) }

  const user = new User(temp_user)
  try {
    await user.save()
  } catch (error) {
    throw new CustomAPIError(error)
  }

  return res.json({ return: true, msg: user })
})

router.post('/login', [
  body('username').not().isEmpty(),
  body('password').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('invalid value', 400)
  }

  const { username, password } = req.body
  const [user] = await User.find({ username })
  if (user.length === 0) {
    throw new CustomAPIError('No user is found with that name', 404)
  }

  const checkPWD = await bcrpyt.compare(password, user.password)
  if (!checkPWD) {
    throw new CustomAPIError('Incorrect password', 400)
  }

  const token = jwt.sign({ userID: user.__id, role: user.role }, 'JWTSECRET')

  return res.json({ return: true, msg: token })
})

module.exports = router