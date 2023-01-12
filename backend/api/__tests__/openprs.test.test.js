const request = require('supertest')
const server = require('../../server.js')
const errors = require('../../constants/errorStrings.js')

describe('[GET] /openprs', () => {
  describe('Validation of URL params', () => {
    test('repo not found due to bad user name', async () => {
      const badRepo = 'https://github.com/expressjs/expressXXX'
      const badURL = `/api/openprs?repo=${badRepo}`
      const res = await request(server).get(badURL)
      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ message: errors.nonExistingRepo })
    })
    test('repo not found due to bad repo name', async () => {
      const badRepo = 'https://github.com/expressjsXXX/express'
      const badURL = `/api/openprs?repo=${badRepo}`
      const res = await request(server).get(badURL)
      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ message: errors.nonExistingRepo })
    })
    test('repo not found due to incorrect URL format', async () => {
      const badRepo = 'https://github.com'
      const badURL = `/api/openprs?repo=${badRepo}`
      const res = await request(server).get(badURL)
      expect(res.status).toBe(422)
      expect(res.body).toMatchObject({
        message: errors.improperRepoURL,
      })
    })
    test('constructs correct URL on bad limit', async () => {
      const res = await request(server).get('/api/openprs?repo=https://github.com/expressjs/express&limit=foo')
      expect(res.status).toBe(200)
      expect(res.body.github_api.url).toBe('https://api.github.com/repos/expressjs/express/pulls?state=open&per_page=1&page=1')
    })
    test('constructs correct on bad page', async () => {
      const res = await request(server).get('/api/openprs?repo=https://github.com/expressjs/express&page=foo')
      expect(res.status).toBe(200)
      expect(res.body.github_api.url).toBe('https://api.github.com/repos/expressjs/express/pulls?state=open&per_page=1&page=1')
    })
  })
})
