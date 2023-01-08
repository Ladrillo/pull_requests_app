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
    const urlPRs = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`

    const responsePRs = await fetch(urlPRs, { headers })

    const githubResponseHeaders = responsePRs.headers.entries()
    const headersForClient = []
    for (let header of githubResponseHeaders) {
      headersForClient.push(header)
    }
    const jsonPRs = await responsePRs.json()
    const commitPromises = jsonPRs.map(pr => {
      const headers = new Headers
      headers.set('X-GitHub-Api-Version', '2022-11-28')
      headers.set('Accept', 'application/vnd.github+json')
      headers.set('Authorization', `Basic ${authString}`)

      const urlCommits = `https://api.github.com/repos/${user}/${repo}/pulls/${pr.number}/commits`
      return fetch(urlCommits, { headers })
    })

    const responseCommits = await Promise.all(commitPromises)
    const jsonCommits = await Promise.all(responseCommits.map(res => res.json()))

    const dataForClient = jsonPRs.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      commits: jsonCommits,
    }))
    res.json(dataForClient)
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
