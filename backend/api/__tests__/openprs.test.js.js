const request = require('supertest')
const server = require('../../server.js')
const errors = require('../../constants/errorStrings.js')

describe('[GET] /openprs', () => {
  describe('GitHub URL validation errors', () => {
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
  })
})
