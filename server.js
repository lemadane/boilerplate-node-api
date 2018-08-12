const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const log = require('fancy-log')
const { dev } = require('./env.json')

const api = express()
api.use(bodyParser.urlencoded({ extended: true }))
api.use(bodyParser.json())
api.use('/api/v1', routes)

api.listen(dev.webPort, dev.webHost, err => {
      if (err) {
            log.error('Error starting server. ' + err.message)
      } else {
            log(`Server is listening on, http://${dev.webHost}:${dev.webPort}`)
      }
})