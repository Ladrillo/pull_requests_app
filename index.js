require('dotenv').config()

const server = require('./backend/server.js')

const PORT = 9000

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
