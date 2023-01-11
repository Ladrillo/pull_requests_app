const express = require('express')
const router = express.Router()

const errors = require('../constants/errorStrings.js')
const { parseRepoURL } = require('../middleware/validation.js')
const { openPRsPaginationLinks } = require('../utils/pagination.js')
const {
  getRateLimit,
  getPullRequests,
  getPullRequestCommits,
} = require('../utils/github.js')

router.get('/api/openprs', parseRepoURL, async (req, res, next) => {
  try {
    const { repo, user, repoURL } = req.repoData
    const { page = 1, limit = 100 } = req.query
    const [pullRequests, { link }] = await getPullRequests({ user, repo, limit, page })
    if (pullRequests.message === 'Not Found') {
      return next({ status: 404, message: errors.nonExistingRepo })
    }
    const commitPromises = pullRequests.map(pr => {
      return getPullRequestCommits({ user, repo, number: pr.number })
    })
    const commits = await Promise.all(commitPromises)
    const [rateLimit] = await getRateLimit()
    const dataForClient = {
      links: link ? openPRsPaginationLinks(link, encodeURI(repoURL)) : null,
      rateLimitRemaining: rateLimit.rate.remaining,
      data: pullRequests.map((pr, idx) => {
        const { id, number, title, author } = pr
        return {
          id, number, title, author,
          commit_count: commits[idx][0].length,
          commits: commits[idx][0].map(commit => {
            return commit.commit.message
          }),
        }
      })
    }
    res.json(dataForClient)
  } catch (error) { next(error) }
})

module.exports = router
