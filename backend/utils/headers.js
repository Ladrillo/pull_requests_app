const { authString } = require('../../config.js')
const parse = require('parse-link-header')

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
  const result = { rawHeaders: {} }
  for (let header of githubResponseHeaders) {
    result.rawHeaders[header[0]] = header[1]
  }
  if (result.rawHeaders['x-ratelimit-remaining']) {
    result.rateLimitRemaining = result.rawHeaders['x-ratelimit-remaining']
  }
  if (result.rawHeaders['link']) {
    result.links = parse(result.rawHeaders['link'])
  }
  console.log(result)
  return result
}

module.exports = {
  gitHubAPIHeadersSet,
  gitHubAPIHeadersGet,
}
