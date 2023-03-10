const path = require('path')
const express = require('express')
const helmet = require('helmet')

const prRouter = require('./api/openprs.js')
const errorHandling = require('./middleware/error.js')

const server = express()

server.use(helmet())
server.use(express.static(path.join(__dirname, '../frontend')))
server.use(prRouter)
server.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/index.html')
  console.log(indexPath)
  res.sendFile(indexPath)
})

server.use(errorHandling)

module.exports = server
