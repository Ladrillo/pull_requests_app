const parse = require('parse-link-header')
const { origin } = require('../../config.js')

function openPRsPaginationLinks(linkHeader, repoURLEncoded) {
  let result = {}
  const parsedLinks = parse(linkHeader)
  for (let link in parsedLinks) {
    const { per_page, page } = parsedLinks[link]
    const url = `${origin}/api/openprs?repo=${repoURLEncoded}&limit=${per_page}&page=${page}`
    result[link] = { url }
  }
  return result
}

module.exports = {
  openPRsPaginationLinks,
}
