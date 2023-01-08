(function () {
  const resultsPerPageSelect = document.querySelector('#resultsPerPageSelect')
  const pageNumberSelect = document.querySelector('#pageNumberSelect')
  const openPRForm = document.querySelector('#openPRForm')
  const URLInput = document.querySelector('#URLInput')
  const errorMessage = document.querySelector('#errorMessage')
  const nextButton = document.querySelector('#nextButton')
  const lastButton = document.querySelector('#lastButton')
  const prevButton = document.querySelector('#prevButton')

  const setClickHandlers = (id, repo, limit, next) => {
    const button = document.getElementById(id)
    button.disabled = false
    button.onclick = async () => {
      const response = await fetch(`/doit?repo=${repo}&limit=${limit}&page=${next.page}`)
      const json = await response.json()
      console.log(json)
    }
  }

  const submit = async evt => {
    evt.preventDefault()
    try {
      const limit = resultsPerPageSelect.value
      const page = pageNumberSelect.value

      const repoRaw = URLInput.value.trim()
      const repo = encodeURIComponent(repoRaw)

      const response = await fetch(`/doit?repo=${repo}&limit=${limit}&page=${page}`)
      const json = await response.json()
      console.log(json)

      if (response.status !== 200) {
        errorMessage.textContent = json.message
      } else {
        if (json.links) {
          setClickHandlers('nextButton', repo, limit, json.links.next)
        }
      }
    } catch (error) {
      console.error(error.message)
      errorMessage.textContent = 'Something went horribly wrong... Please reload the page.'
    }
  }

  openPRForm.addEventListener('submit', submit)
}())
