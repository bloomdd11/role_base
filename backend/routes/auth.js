const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const CustomAPIError = require('../middleware/custom-api')
const User = require('../model/User')

router.post('/login', async (req, res) => {
  return res.json({ return: true, msg: 'login' })
})
router.post('/signup', async (req, res) => {
  return res.json({ return: true, msg: 'signup' })
})

module.exports = router