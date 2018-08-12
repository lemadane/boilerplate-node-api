const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const log = require('fancy-log')
const { dev } = require('./env.json')
const httpLog = require('morgan-body')
const cors = require('cors')
const db = require('./lib/db')

try {
      const api = express()
      httpLog(api)

      api.use(bodyParser.urlencoded({ extended: true }))
      api.use(bodyParser.json())
      api.use('/api/v1', routes)
      api.use(cors())

      const env = dev

      db.configure({
            client: env.db.client,
            version: env.db.version,
            connection: {
                  host: env.db.host,
                  user: env.db.user,
                  password: env.db.password,
                  database: env.db.name
            },
            pool: {
                  min: env.db.minClients,
                  max: env.db.maxClients
            },
            acquireConnectionTimeout: env.db.idleTimeoutMillis
            
      }).catch(err => {
            throw { message: 'Database config error: ' + err.message }
      })

      api.listen(
            env.http.port,
            env.http.host, err => {
                  if (err) {
                        throw { message: 'Error starting server. ' + err.message }
                  } else {
                        log(`Server is listening on, http://${env.http.host}:${env.http.port}`)
                  }
            })

} catch (err) {
      log.error(err.message)
}