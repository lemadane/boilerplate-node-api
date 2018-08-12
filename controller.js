const schema = require('./lib/schema')
const signInSchema = require('./signin.schema')
const log = require('fancy-log')

exports.signIn = async (req, res) => {
      try {
            schema.check(req.body, signInSchema)
            res.status('200').json(req.body)
      } catch (err) {
            log(err.message)
            res.status('400').json({ error: err.message })
      }

} 