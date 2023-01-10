const express = require('express')

const router = express.Router()

const { parseRepoURL } = require('../middleware/validation.js')
const { openPRsPaginationLinks } = require('../utils/pagination.js')
const { getRateLimit, getPullRequests, getPullRequestCommits } = require('../utils/github.js')

/**
{
  links: {
    next: {
      url: "/api/openprs?repo=https://github.com/expressjs/express&limit=1&page=2",
    },
    last: {
      url: "/api/openprs?repo=https://github.com/expressjs/express&limit=1&page=53",
    },
  },
  rateLimitRemaining: 4855,
  data: [
    {
      id: 1165838603,
      number: 5063,
      title: "chore: Add Node.js version 19",
      author: "sheplu",
      commit_count: 1,
      commits: [
        "chore: Add Node.js version 19",
      ],
    },
  ],
}
 */
router.get('/api/openprs', parseRepoURL, async (req, res, next) => {
  try {
    const { repo, user, repoURL } = req.repoData
    const { page = 1, limit = 100 } = req.query

    const [pullRequests, { link }] = await getPullRequests({ user, repo, limit, page })

    if (pullRequests.message === 'Not Found') {
      return next({ status: 404, message: 'Repository not found. Fix the URL and try again...' })
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
        return {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          author: pr.user.login,
          commit_count: commits[idx][0].length,
          commits: commits[idx][0].map(commit => {
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
