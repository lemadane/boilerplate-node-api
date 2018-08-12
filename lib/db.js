const knex = require('knex')

let config 

exports.configure = async (setting) => {
    config = await knex(setting)
    return Promise.resolve(config)
}

exports.raw = async (sql) => {
    const result = await config.raw(sql);
    return Promise.resolve(result.rows);
}