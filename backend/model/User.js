const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
  },
  password: {
    type: 'String',
    required: true,
    minlength: 4,
  },
  role: {
    type: String,
    default: 'User'
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Users', userSchema)