function isGithubURL(req, res, next) {
  // credit for regex to Hicham https://serverfault.com/questions/417241/extract-repository-name-from-github-url-in-bash
  const regex = /^(https|git)(:\/\/|@)([^\/:]+)[\/:](?<user>[^\/:]+)\/(?<repo>.+)(.git)*$/
  const checksOut = regex.test(req.query.repo)
  if (checksOut) {
    const result = regex.exec(req.query.repo)
    const { user, repo } = result.groups
    req.repoData = { user, repo }
    next()
  }
  else next({ status: 422, message: 'Dis no look like Github repo URL' })
}

module.exports = {
  isGithubURL,
}
