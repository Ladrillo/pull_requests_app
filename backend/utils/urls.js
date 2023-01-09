function openPRsURL(user, repo, limit, page) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls?state=open&per_page=${limit}&page=${page}`
  return url
}

function commitsPRURL(user, repo, number) {
  const url = `https://api.github.com/repos/${user}/${repo}/pulls/${number}/commits`
  return url
}

module.exports = {
  openPRsURL,
  commitsPRURL,
}
