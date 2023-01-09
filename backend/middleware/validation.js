function parseGitHubURL(req, res, next) {
  // Credit for regex to Hicham https://serverfault.com/a/917253
  // eslint-disable-next-line
  const regex = /^(https|git)(:\/\/|@)([^\/:]+)[\/:](?<user>[^\/:]+)\/(?<repo>.+)(.git)*$/
  const checksOut = regex.test(req.query.repo)
  if (checksOut) {
    let { groups: { user, repo } } = regex.exec(req.query.repo)
    if (/\.git$/.test(repo)) repo = repo.slice(0, repo.length - 4)
    req.repoData = { user, repo }
    next()
  }
  else {
    next({
      status: 422, message: `Invalid repo URL. Please provide a URL in the following patterns:
        git://github.com/some-user/my-repo.git
        git@github.com:some-user/my-repo.git
        https://github.com/some-user/my-repo.git
        https://github.com/some-user/my-repo
      `
    })
  }
}

module.exports = {
  parseGitHubURL,
}
