const path = require('path')
const express = require('express')
const { errorHandling } = require('./middleware/error_handling.js')
const { parseGitHubURL } = require('./middleware/validation.js')
const { authString } = require('../config.js')

const server = express()

server.use(express.static(path.join(__dirname, '../frontend')))

server.get('/doit', parseGitHubURL, async (req, res, next) => {
  try {
    const headers = new Headers
    headers.set('X-GitHub-Api-Version', '2022-11-28')
    headers.set('Accept', 'application/vnd.github+json')
    headers.set('Authorization', `Basic ${authString}`)

    const { repo, user } = req.repoData
    const { page = 1, limit = 100 } = req.query
    const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`

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
