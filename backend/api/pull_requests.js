const express = require('express')

const router = express.Router()

const { parseRepoURL } = require('../middleware/validation.js')
const { gitHubAPIHeadersGet, gitHubAPIHeadersSet } = require('../utils/headers.js')
const { openPRsURL, commitsPRURL, openPRsPaginationLinks } = require('../utils/urls.js')

router.get('/api/openprs', parseRepoURL, async (req, res, next) => {
  try {
    const headers = gitHubAPIHeadersSet()

    const { repo, user, repoURLEncoded } = req.repoData
    const { page = 1, limit = 100 } = req.query
    const urlPRs = openPRsURL({ user, repo, limit, page })

    const responsePRs = await fetch(urlPRs, { headers })
    const jsonPRs = await responsePRs.json()

    if (jsonPRs.message === 'Not Found') {
      return next({ status: 404, message: 'Repository not found. Fix the URL and try again...' })
    }

    const commitPromises = jsonPRs.map(pr => {
      const urlCommits = commitsPRURL({ user, repo, number: pr.number })
      return fetch(urlCommits, { headers })
    })
    const responseCommits = await Promise.all(commitPromises)
    const jsonCommits = await Promise.all(responseCommits.map(res => res.json()))
    const resRateLimit = await fetch('https://api.github.com/rate_limit', { headers })
    const rateLimit = await resRateLimit.json()

    const responseHeaders = gitHubAPIHeadersGet(responsePRs.headers)
    const links = openPRsPaginationLinks(responseHeaders.links, repoURLEncoded)

    const dataForClient = {
      links,
      rateLimitRemaining: rateLimit.rate.remaining,
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

module.exports = router
