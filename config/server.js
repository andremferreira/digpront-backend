const port = 3000

const bodyParser = require('body-parser')
const express = require('express')
// const exphbs = require('express-handlebars')
// const nodemailer = require('nodemailer')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')
// const multer = require('multer')

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(allowCors)
server.use(queryParser())

server.listen(port, function() {
  console.log(`BACKEND is running on port ${port}.`)
})

module.exports = server
