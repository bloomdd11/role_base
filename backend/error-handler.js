module.exports = ErrorHandler = (err, req, res, next) => {
  let errorObject = {
    msg: err.message || 'Something went wrong',
    statusCode: err.statusCode || 500
  }
  // return res.status(errorObject.statusCode).send(err.message)
  return res.status(errorObject.statusCode).json({ return: true, msg: errorObject.msg })
}