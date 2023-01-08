const username = process.env.USERNAME
const token = process.env.ACCESS_TOKEN
const authString = process.env.ACCESS_TOKEN ? Buffer.from(`${username}:${token}`).toString('base64') : ''

module.exports = {
  token,
  username,
  authString,
}
