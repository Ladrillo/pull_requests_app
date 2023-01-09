function parseRepoURL(req, res, next) {
  // Credit for regex to Hicham https://serverfault.com/a/917253
  // eslint-disable-next-line
  const regex = /^(https|git)(:\/\/|@)([^\/:]+)[\/:](?<user>[^\/:]+)\/(?<repo>.+)(.git)*$/
  const checksOut = regex.test(req.query.repo)
  if (checksOut) {
    let { groups: { user, repo } } = regex.exec(req.query.repo)
    if (/\.git$/.test(repo)) repo = repo.slice(0, repo.length - 4)
    req.repoData = {
      user,
      repo,
      repoURL: req.query.repo,
      repoURLEncoded: encodeURI(req.query.repo),
    }
    next()
  }
  else {
    next({
      status: 422, message: `Invalid repo URL. Please provide URL in the following format:
        "git://github.com/user/repo.git" or
        "git@github.com:user/repo.git" or
        "https://github.com/user/repo.git" or
        "https://github.com/user/repo"
      `
    })
  }
}

module.exports = {
  parseRepoURL,
}
