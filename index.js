require('dotenv').config()

const { port } = require('./config.js')
const server = require('./backend/server.js')

server.listen(port, () => {
  console.log(`Listening on ${port}`)
})
