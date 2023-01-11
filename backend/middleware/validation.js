const errors = require('../constants/errorStrings.js')
const yup = require('yup')

// Credit for regex to Hicham https://serverfault.com/a/917253
const gitHubRepoURLRegex = /^(https|git)(:\/\/|@)([^\/:]+)[\/:](?<user>[^\/:]+)\/(?<repo>.+)(.git)*$/

const fields = {
  page: {
    schema: () => yup
      .number()
      .min(1, errors.limitBetween1and100)
      .max(100, errors.limitBetween1and100)
  },
  limit: {
    schema: () => yup
      .number()
      .min(1, errors.limitBetween1and100)
      .max(100, errors.limitBetween1and100)
  },
  repo: {
    schema: () => yup
      .string()
      .required(errors.repoNameRequired)
      .test(
        'gitHubRepoURLProper',
        errors.improperRepoURL,
        function (query) {
          const checksOut = gitHubRepoURLRegex.test(JSON.parse(query).repoURL)
          return checksOut
        }
      )
      .transform(
        function (url) {
          let { groups: { user, repo } } = gitHubRepoURLRegex.exec(url)
          if (/\.git$/.test(repo)) repo = repo.slice(0, repo.length - 4)
          return JSON.stringify({ user, repo, repoURL: url })
        }
      )
  },
}

const optionsQueryOpenPRs = yup.object().shape({
  repo: fields.repo.schema(),
  page: fields.page.schema(),
  limit: fields.limit.schema(),
})

async function validateOpenPRsQuery(req, res, next) {
  try {
    const cast = await optionsQueryOpenPRs.validate(req.query, { stripUnknown: true })
    req.query = cast
    next()
  } catch (err) {
    next({ status: 422, message: errors.improperRepoURL })
  }
}

module.exports = {
  validateOpenPRsQuery,
}
