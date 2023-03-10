(function () {
  const resultsPerPageSelect = document.querySelector('#resultsPerPageSelect')
  const openPRForm = document.querySelector('#openPRForm')
  const URLInput = document.querySelector('#URLInput')
  const errorMessage = document.querySelector('#errorMessage')
  const firstButton = document.querySelector('#firstButton')
  const prevButton = document.querySelector('#prevButton')
  const nextButton = document.querySelector('#nextButton')
  const lastButton = document.querySelector('#lastButton')
  const pagination = { first: firstButton, prev: prevButton, next: nextButton, last: lastButton }
  const ratelimit = document.querySelector('#rateLimit')
  const spinner = document.querySelector('#spinner')
  const prs = document.querySelector('#prs')

  const setClickHandlers = (links) => {
    for (let direction in pagination) {
      const btn = pagination[direction]
      if (links[direction]) {
        btn.disabled = false
        btn.onclick = async () => {
          await makeRequest(links[direction].url)
        }
      } else {
        btn.disabled = true
        btn.onclick = Function.prototype
      }
    }
    for (let direction in links) {
      const btn = pagination[direction]
      btn.disabled = false
      btn.onclick = async () => {
        await makeRequest(links[direction].url)
      }
    }
  }

  const makeRequest = async (url) => {
    try {
      Object.values(pagination).forEach(btn => btn.disabled = true)
      prs.innerHTML = ''
      ratelimit.innerHTML = ''
      errorMessage.textContent = ''
      spinner.classList.remove('off')
      const response = await fetch(url)
      const json = await response.json()
      spinner.classList.add('off')

      if (response.status !== 200) {
        errorMessage.textContent = json.message
      } else {
        drawPRs(json.data)
        console.log(json)
        if (json.links) {
          setClickHandlers(json.links)
        }
        if (json.github_api?.rate_limit) {
          ratelimit.textContent = `
            See the Console and Network tabs for more info. ${json.github_api?.rate_limit} requests left!
          `
        }
      }
    } catch (error) {
      console.error(error.message)
      errorMessage.textContent = error.message || 'Something went horribly wrong... Please reload the page.'
    }
  }

  const drawPRs = data => {
    prs.innerHTML = ''
    data.forEach(pr => {
      const li = document.createElement('li')
      li.className = 'pr'
      const ol = document.createElement('ol')
      li.textContent = `[${pr.number}] ${pr.title}`
      pr.commits.forEach(com => {
        const li = document.createElement('li')
        li.className = 'commit'
        li.textContent = com
        ol.append(li)
      })
      li.append(ol)
      prs.append(li)
    })
  }

  const submit = async evt => {
    evt.preventDefault()
    try {
      const limit = resultsPerPageSelect.value
      const repoRaw = URLInput.value.trim()
      const repo = encodeURIComponent(repoRaw)

      await makeRequest(`/api/openprs?repo=${repo}&limit=${limit}&page=${1}`)
    } catch (error) {
      console.error(error.message)
      errorMessage.textContent = error.message || 'Something went horribly wrong... Please reload the page.'
    }
  }

  openPRForm.addEventListener('submit', submit)
}())
