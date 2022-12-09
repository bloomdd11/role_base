const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

module.exports = mongoose.model('Posts', postSchema)