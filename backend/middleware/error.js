const errors = require('../constants/errorStrings.js')

function errorHandling(err, req, res, next) { // eslint-disable-line
  const { message, stack, status } = err
  console.log(errors.serverLogs({ message, stack, status }))
  const response = {}
  if ((process.env.NODE_ENV !== 'production') && stack) {
    response.stack = stack
  }
  if (status !== 500) {
    response.message = err.message
  } else {
    response.message = errors.unknownError
  }
  res.status(status || 500).json(response)
}

module.exports = errorHandling
