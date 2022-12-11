const express = require('express')
const router = express.Router()
const CustomAPIError = require('../middleware/custom-api')
const Post = require('../model/Post')
const { body, validationResult, param } = require('express-validator')

// GET ALL POSTS
router.get('/', async (req, res) => {
  const { userID, username, role } = req.user

  const post = await Post.find().populate('postBy')
  // const post = await Post.find({ postBy: { _id: userID } }).populate('postBy')
  return res.json({ meta: { return: true, length: post.length, request: req.user }, msg: post })
})

// GET SPECIFIC POST
router.get('/:id', [
  param('id').isMongoId(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('invalid id', 400)
  }

  const { id: postID } = req.params
  const post = await Post.findById({ _id: postID }).populate('postBy')
  if (!post) {
    throw new CustomAPIError('no post with that id is found', 404)
  }

  return res.json({ meta: { return: true }, msg: post })
})

// CREATE POST
router.post('/', [
  body('title').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('please enter title name', 400)
  }

  const { userID, username, role } = req.user
  const { title } = req.body
  const temp_post = { title, postBy: userID }
  const post = new Post(temp_post)

  try {
    await post.save()
  } catch (error) {
    throw new CustomAPIError(error, 500)
  }

  return res.json({ meta: { return: true }, msg: post })
})

// UPDATE POST
router.put('/:id', [
  param('id').isMongoId()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('invalid id', 400)
  }

  const { title } = req.body
  const { id: postID } = req.params

  let post = await Post.findById({ _id: postID })
  if (!post) {
    throw new CustomAPIError('no post with that id is found', 400)
  }

  const temp_post = { title }
  post = await Post.findByIdAndUpdate({ _id: postID }, temp_post, { new: true })

  try {
    await post.save()
  } catch (error) {
    throw new CustomAPIError(error, 500)
  }

  return res.json({ return: true, msg: post })
})

// DELETE POSTS
router.delete('/:id', [
  param('id').isMongoId(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomAPIError('invalid id', 400)
  }

  const { id: postID } = req.params
  const post = await Post.findById({ _id: postID })
  if (!post) {
    throw new CustomAPIError('no post with that id is found', 404)
  }
  try {
    await Post.findByIdAndDelete({ _id: postID })
  } catch (error) {
    throw new CustomAPIError(error)
  }

  return res.json({ meta: { return: true }, msg: 'done' })
})

module.exports = router