const express = require('express')
const router = express.Router()
const CustomAPIError = require('../middleware/custom-api')
const User = require('../model/User')
const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

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
    throw new CustomAPIError('Please provide username and password', 400)
  }

  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) {
    throw new CustomAPIError('Invalid Credentials', 404)
  }

  let checkPWD = await user.comparePassword(password)
  if (!checkPWD) {
    throw new CustomAPIError('Incorrect password', 400)
  }

  const token = user.createJWT()

  return res.json({ return: true, token })
})

module.exports = router