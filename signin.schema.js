const schema = require('./lib/schema')

const signInSchema = schema.object().keys({
    username: schema.string().required(),
    password: schema.string().required()
});

module.exports = signInSchema