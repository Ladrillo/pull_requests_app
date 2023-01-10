function errorHandling(err, req, res, next) { // eslint-disable-line
  const { message, stack, status } = err
  console.log(`\nERROR START =============\n
Message: ${message}
Status: ${status || 'No status code'}
Stack: ${stack || 'No stack trace'}
\nERROR END ===============\n`)

  const response = {}
  if ((process.env.NODE_ENV !== 'production') && stack) {
    response.stack = stack
  }
  if (status !== 500) {
    response.message = err.message
  } else {
    response.message = 'Something bad and unexpected happened'
  }
  res.status(status || 500).json(response)
}

module.exports = errorHandling
