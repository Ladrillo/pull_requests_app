const { authString } = require('../../config.js')

function gitHubAPIHeadersSet() {
  const headers = new Headers
  headers.set('X-GitHub-Api-Version', '2022-11-28')
  headers.set('Accept', 'application/vnd.github+json')
  if (authString) {
    headers.set('Authorization', `Basic ${authString}`)
  }
  return headers
}

function gitHubAPIHeadersGet(headers) {
  const githubResponseHeaders = headers.entries()
  const result = {}
  for (let header of githubResponseHeaders) {
    result[header[0]] = header[1]
  }
  console.log(result)
  return result
}

module.exports = {
  gitHubAPIHeadersSet,
  gitHubAPIHeadersGet,
}
