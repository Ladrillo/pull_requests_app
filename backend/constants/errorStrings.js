module.exports = {
  unknownError: 'Something bad and unexpected happened',
  nonExistingRepo: 'Repository not found. Fix the URL and try again...',
  improperRepoURL: `Invalid repo URL.
Please provide URL in the following format:
"git://github.com/user/repo.git" or
"git@github.com:user/repo.git" or
"https://github.com/user/repo.git" or
"https://github.com/user/repo"`,
  serverLogs: ({ message, status, stack }) => `\nERROR START =============\n
Message: ${message}
Status: ${status || 'No status code'}
Stack: ${stack || 'No stack trace'}
\nERROR END ===============\n`,
  repoNameRequired: 'repo name is required',
  ownerOfRepoRequired: 'owner of repo is required',
  limitBetween1and100: 'limit between 1 and 100',
}
