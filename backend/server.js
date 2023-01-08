const path = require('path')
const express = require('express')
const { errorHandling } = require('./middleware/error_handling.js')
const { isGithubURL } = require('./middleware/validation.js')
const { authString } = require('../config.js')

const server = express()

server.use(express.static(path.join(__dirname, '../frontend')))
function promiseRejection() {
  return Promise.reject(new Error('fail'))
}
server.get('/doit', isGithubURL, async (req, res, next) => {
  try {
    await promiseRejection()
    const { repo, user } = req.repoData
    const { page = 1, limit = 100 } = req.query

    const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`
    const headers = new Headers
    headers.set('Authorization', `Basic ${authString}`)

    const response = await fetch(url, { headers })
    const githubResponseHeaders = response.headers.entries()
    const headersForClient = []
    for (let header of githubResponseHeaders) {
      headersForClient.push(header)
    }
    const json = await response.json()
    res.json({ data: json, headers: headersForClient })
  } catch (error) {
    next(error)
  }
})

server.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/index.html')
  console.log(indexPath)
  res.sendFile(indexPath)
})

server.use(errorHandling)

module.exports = server
