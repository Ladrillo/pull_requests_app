const username = process.env.USERNAME
const token = process.env.ACCESS_TOKEN
const authString = process.env.ACCESS_TOKEN ? Buffer.from(`${username}:${token}`).toString('base64') : ''
const port = process.env.PORT || 9000
const baseURL = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${port}`

module.exports = {
  token,
  username,
  authString,
  port,
  baseURL,
}
