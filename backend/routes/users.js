const express = require('express')
const router = express.Router()
const CustomAPIError = require('../middleware/custom-api')
const User = require('../model/User')
const { body, validationResult, param } = require('express-validator')


// GET ALL USERS
router.get('/', async (req, res) => {
  // 
  // 
  // 
  const { userID, username, role } = req.user
  // 
  // 
  // 
  const users = await User.find()
  return res.json({ meta: { return: true, length: users.length, currentUser: req.user }, msg: users })
})

// GET SPECIFIC USERS
router.get('/:id', [
  param('id').isMongoId()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('invalid id', 400)
  }

  const user = await User.findById({ _id: req.params.id })
  if (!user) {
    throw new CustomAPIError('no user with that id is found', 400)
  }
  return res.json({ meta: { return: true, length: 1 }, msg: user })
})

// CHANGE USER ROLE
router.put('/:id', [
  param('id').isMongoId(),
  body('role').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError(errors.array, 400)
  }

  const { id: userID } = req.params
  const { role } = req.body

  let user = await User.findById({ _id: userID })
  if (!user) {
    throw new CustomAPIError('no user with that id is found', 400)
  }

  const temp_user = { role }
  user = await User.findByIdAndUpdate({ _id: req.params.id }, temp_user, { new: true })

  return res.json({ meta: { return: true, length: 1 }, msg: user })
})

module.exports = router