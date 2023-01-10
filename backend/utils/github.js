const { gitHubAPIHeadersSet, gitHubAPIHeadersGet } = require('../utils/headers.js')

async function getRequest(url) {
  try {
    const headers = gitHubAPIHeadersSet()
    const res = await fetch(url, { headers })
    const json = await res.json()
    const resHeaders = gitHubAPIHeadersGet(res.headers)
    return [json, resHeaders]
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getRateLimit() {
  const url = 'https://api.github.com/rate_limit'
  return getRequest(url)
}

async function getPullRequests({ user, repo, limit, page }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`
  return getRequest(url)
}

async function getPullRequestCommits({ user, repo, number }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls/${number}/commits`
  return getRequest(url)
}

module.exports = {
  getRateLimit,
  getPullRequests,
  getPullRequestCommits,
}
