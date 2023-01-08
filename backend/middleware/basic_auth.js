const { authString } = require('../../config.js')

function basicAuth(req, res, next) {
  res.set('Authorization', `Basic ${authString}`)
  console.log(res)
  next()
}

module.exports = { basicAuth }
