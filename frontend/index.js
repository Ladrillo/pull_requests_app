(function () {
  const submit = async evt => {
    evt.preventDefault()
    const limit = resultsPerPageSelect.value
    const page = pageNumberSelect.value

    const repoRaw = URLInput.value.trim()
    const repo = encodeURIComponent(repoRaw)

    const response = await fetch(`/doit?repo=${repo}&limit=${limit}&page=${page}`)
    const json = await response.json()

    if (response.status !== 200) {
      errorMessage.textContent = json.message
    }
    console.log(json)
  }

  openPRForm.addEventListener('submit', submit)
}())
