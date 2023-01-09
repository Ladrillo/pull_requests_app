const username = process.env.USERNAME
const token = process.env.ACCESS_TOKEN
const authString = (username && token) ? Buffer.from(`${username}:${token}`).toString('base64') : ''
const origin = process.env.NODE_ENV === 'production' ? 'https://pr-app.herokuapp.com' : ''
const port = process.env.PORT || 9000

module.exports = {
  authString,
  origin,
  port,
}
