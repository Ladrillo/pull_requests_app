function openPRsURL({ user, repo, limit, page }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`
  return url
}

function commitsPRURL({ user, repo, number }) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls/${number}/commits`
  return url
}

/*
rawLinks has the following shape

first: {state: 'open', per_page: '1', page: '1', rel: 'first', url: 'https://api.github.com/repositories/10270250/pulls?state=open&per_page=1&page=1'}
last: {state: 'open', per_page: '1', page: '250', rel: 'last', url: 'https://api.github.com/repositories/10270250/pulls?state=open&per_page=1&page=250'}
next: {state: 'open', per_page: '1', page: '3', rel: 'next', url: 'https://api.github.com/repositories/10270250/pulls?state=open&per_page=1&page=3'}
prev: {state: 'open', per_page: '1', page: '1', rel: 'prev', url: 'https://api.github.com/repositories/10270250/pulls?state=open&per_page=1&page=1'}
*/
function openPRsPaginationLinks(rawLinks, { user, repo }) {
  let result = {}
  for (let link in rawLinks) {
    const { per_page, rel, page } = rawLinks[link]
    result[link] = {
      url: openPRsURL({ user, repo, page, limit: per_page }),
      rel,
    }
  }
  return result
}

module.exports = {
  openPRsURL,
  commitsPRURL,
  openPRsPaginationLinks,
}
