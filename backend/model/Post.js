const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
})

module.exports = mongoose.model('Posts', postSchema)