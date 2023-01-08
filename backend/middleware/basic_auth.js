const { authString } = require('../../config.js')

function basicAuth(req, res, next) {
  res.set('Authorization', `Basic ${Buffer.from(authString).toString('base64')}`)
  console.log(res)
  next()
}

module.exports = { basicAuth }
