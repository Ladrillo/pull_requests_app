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

    const [pullRequests, { link }, url] = await getPullRequests({ user, repo, limit, page })
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
      links: link ? openPRsPaginationLinks(link, encodeURI(repoURL)) : null,
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
