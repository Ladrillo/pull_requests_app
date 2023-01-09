const { origin } = require('../../config.js')

function openPRsURL({ user, repo, limit, page }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`
  return url
}

function commitsPRURL({ user, repo, number }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls/${number}/commits`
  return url
}

function openPRsURLPublic({ repoURLEncoded, limit, page }) {
  const url = `${origin}/api/openprs?repo=${repoURLEncoded}&limit=${limit}&page=${page}`
  return url
}

function openPRsPaginationLinks(rawLinks, repoURLEncoded) {
  let result = {}
  for (let link in rawLinks) {
    const { per_page, page } = rawLinks[link]
    const url = openPRsURLPublic({ repoURLEncoded, limit: per_page, page })
    result[link] = { url }
  }
  return result
}

module.exports = {
  openPRsURL,
  commitsPRURL,
  openPRsURLPublic,
  openPRsPaginationLinks,
}
