const express = require('express')
const controller = require('./controller')
const routes = express.Router()

routes
      .get('/', (req, res) => res.send('Retail Node API is Ready!!'))
      .post('/sign-in', controller.signIn)

module.exports = routes