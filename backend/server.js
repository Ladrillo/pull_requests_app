const path = require('path')
const express = require('express')

const { errorHandling } = require('./middleware/error_handling.js')
const { parseRepoURL } = require('./middleware/validation.js')
const { gitHubAPIHeadersGet, gitHubAPIHeadersSet } = require('./utils/headers.js')
const { openPRsURL, commitsPRURL, openPRsPaginationLinks } = require('./utils/urls.js')

const server = express()

server.use(express.static(path.join(__dirname, '../frontend')))

server.get('/doit', parseRepoURL, async (req, res, next) => {
  try {
    const headers = gitHubAPIHeadersSet()

    const { repo, user, repoURLEncoded } = req.repoData
    const { page = 1, limit = 100 } = req.query
    const urlPRs = openPRsURL({ user, repo, limit, page })

    const responsePRs = await fetch(urlPRs, { headers })
    const responseHeaders = gitHubAPIHeadersGet(responsePRs.headers)

    const jsonPRs = await responsePRs.json()
    const commitPromises = jsonPRs.map(pr => {
      const urlCommits = commitsPRURL({ user, repo, number: pr.number })
      return fetch(urlCommits, { headers })
    })

    const responseCommits = await Promise.all(commitPromises)
    const jsonCommits = await Promise.all(responseCommits.map(res => res.json()))
    const links = openPRsPaginationLinks(responseHeaders.links, repoURLEncoded)
    const { rateLimitRemaining } = responseHeaders

    const dataForClient = {
      links,
      rateLimitRemaining,
      data: jsonPRs.map((pr, idx) => {
        return {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          author: pr.user.login,
          commit_count: jsonCommits[idx].length,
          commits: jsonCommits[idx].map(commit => {
            return commit.commit.message
          }),
        }
      })
    }
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
