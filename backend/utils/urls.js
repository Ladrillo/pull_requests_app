function openPRsURL({ user, repo, limit, page }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`
  return url
}

function commitsPRURL({ user, repo, number }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls/${number}/commits`
  return url
}

function openPRsURLPublic({ repoURLEncoded, limit, page }) {
  const url = `/doit?repo=${repoURLEncoded}&limit=${limit}&page=${page}`
  return url
}

function openPRsPaginationLinks(rawLinks, repoURLEncoded) {
  let result = {}
  for (let link in rawLinks) {
    const { per_page, page } = rawLinks[link]
    result[link] = {
      url: openPRsURLPublic({ repoURLEncoded, limit: per_page, page }),
    }
  }
  return result
}

module.exports = {
  openPRsURL,
  commitsPRURL,
  openPRsURLPublic,
  openPRsPaginationLinks,
}
