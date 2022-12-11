const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

// userSchema.pre('save', async (next) => {
//   this.password = await bcrypt.hash(this.password, 10)
//   next()
// })

userSchema.methods.createJWT = function () {
  return jwt.sign({ userID: this._id, username: this.username, role: this.role }, 'JWTSECRET')
}

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('Users', userSchema)