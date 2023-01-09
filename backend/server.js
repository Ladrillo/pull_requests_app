const path = require('path')
const express = require('express')
const parse = require('parse-link-header')

const { errorHandling } = require('./middleware/error_handling.js')
const { parseGitHubURL } = require('./middleware/validation.js')
const { gitHubAPIHeaders } = require('./utils/headers.js')
const { openPRsURL, commitsPRURL } = require('./utils/urls.js')

const server = express()

server.use(express.static(path.join(__dirname, '../frontend')))

server.get('/doit', parseGitHubURL, async (req, res, next) => {
  try {
    const headers = gitHubAPIHeaders()

    const { repo, user } = req.repoData
    const { page = 1, limit = 100 } = req.query
    const urlPRs = openPRsURL(user, repo, limit, page)

    const responsePRs = await fetch(urlPRs, { headers })

    const githubResponseHeaders = responsePRs.headers.entries()
    const headersForClient = []
    for (let header of githubResponseHeaders) {
      headersForClient.push(header)
    }
    const linksHeader = headersForClient.find(header => header[0] === 'link')[1];
    const parsedLinksHeader = parse(linksHeader)
    const jsonPRs = await responsePRs.json()
    const commitPromises = jsonPRs.map(pr => {
      const urlCommits = commitsPRURL(user, repo, pr.number)
      return fetch(urlCommits, { headers })
    })

    const responseCommits = await Promise.all(commitPromises)
    const jsonCommits = await Promise.all(responseCommits.map(res => res.json()))
    const links = {}
    Object.keys(parsedLinksHeader).forEach(link => {
      links[link] = `doit`
    })
    const dataForClient = {
      linky: req.url,
      links,
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
