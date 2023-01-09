const { authString } = require('../../config.js')

function gitHubAPIHeaders() {
  const headers = new Headers
  headers.set('X-GitHub-Api-Version', '2022-11-28')
  headers.set('Accept', 'application/vnd.github+json')
  headers.set('Authorization', `Basic ${authString}`)
  return headers
}

module.exports = {
  gitHubAPIHeaders,
}
