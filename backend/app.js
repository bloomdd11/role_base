require('express-async-errors')

const express = require('express')
const app = express()
const PORT = 3000 || process.env.PORT
const ErrorHandlerMiddleware = require('./error-handler')
const CustomAPIError = require('./middleware/custom-api')
const LOCAL_DB_URL = "mongodb://localhost/role_base"
const auth = require('./routes/auth')
const post = require('./routes/post')
const users = require('./routes/users')
const authMiddleware = require('./middleware/authMIddleware')


const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

// MIDDLEWARE
app.use(express.json())

// ROUTES
app.get('/', (req, res) => {
  res.json({ return: true, msg: 'home page' })
})
app.use('/api/v1', auth)
app.use('/api/v1/posts', authMiddleware, post)
app.use('/api/v1/users', authMiddleware, users)


// LISTEN 
const start = async () => {
  try {
    await require('./db')(LOCAL_DB_URL)
    console.log('Connected to mongodb');
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    })
  } catch (error) {
    throw new CustomAPIError(error)
  }
}

app.use(ErrorHandlerMiddleware)
start()