const express = require('express')
const router = express.Router()

const errors = require('../constants/errorStrings.js')
const { validateOpenPRsQuery } = require('../middleware/validation.js')
const { openPRsPaginationLinks } = require('../utils/pagination.js')
const {
  getRateLimit,
  getPullRequests,
  getPullRequestCommits,
} = require('../utils/github.js')

router.get('/api/openprs', validateOpenPRsQuery, async (req, res, next) => {
  try {
    const { page, limit } = req.query
    const { repoURL, repo, user } = JSON.parse(req.query.repo)

    const [pullRequests, headers, url] = await getPullRequests({ user, repo, limit, page })
    if (headers['x-ratelimit-remaining'] == 0) {
      // todo, this is a bit sketchy
      return next({ status: 429, message: errors.requestLimitReached })
    }
    if (pullRequests.message === 'Not Found') {
      return next({ status: 404, message: errors.nonExistingRepo })
    }
    const commitPromises = pullRequests.map(pr => {
      return getPullRequestCommits({ user, repo, number: pr.number })
    })
    const commits = await Promise.all(commitPromises)
    const [rateLimit] = await getRateLimit()
    const dataForClient = {
      github_api: { url, rate_limit: rateLimit.rate.remaining },
      links: headers.link ? openPRsPaginationLinks(headers.link, encodeURI(repoURL)) : null,
      data: pullRequests.map((pr, idx) => {
        const { id, number, title, author } = pr
        const commit_count = commits[idx][0].length
        // todo, if we hit the rate limit this is sketchy
        const com = commits[idx][0]?.map(commit => commit.commit.message)
        const result = { id, number, title, author, commit_count, commits: com }
        return result
      })
    }
    res.json(dataForClient)
  } catch (error) { next(error) }
})

module.exports = router
