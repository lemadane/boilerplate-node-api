const knex = require('knex')

let config

exports.configure = async (setting) => {
      config = await knex(setting)
      return Promise.resolve(config)
}

exports.raw = async (sql) => {
      const result = await config.raw(sql)
      return Promise.resolve(result.rows)
}


exports.transaction = async () => {
      const knex = await getWriteKnex()
      return new Promise(resolve => knex.transaction((trx) => resolve(trx)))
}

exports.getAll = async (args) => {
      const {
            table,
            filter = null,
            extraFilter = null,
            selecretedParameters = '*',
            limit = null,
            orderBy = null,
            isAsc = false
      } = args

      let query = config(table)
            .where({ disabled: false })
            .select(selectedParameters)
            .limit(limit)

      if (filter instanceof Array) {
            if (filter.length) {
                  for (let i = 0; i < filter.length; i += 3) {
                        query.andWhere(filter[i], filter[i + 1], filter[i + 2])
                  }
            }
      }
      else if (filter instanceof Object) {
            query.andWhere(filter)
      }
      if (extraFilter) {
            query.andWhere(extraFilter)
      }
      if (orderBy) {
            query.orderBy(orderBy, isAsc ? 'asc' : 'desc')
      }
      let queryString = query.toString()
      return await query
}


exports._getAll = async (args) => {

      const {
            table,
            filter,
            extraFilter = null,
            selectedParameters = '*',
            limit = null,
            orderby = null,
            isAsc = false
      } = args

      let query = knex(table)
            .select(selectedParameters)
            .limit(limit)

      if (filter instanceof Array) {
            if (filter.length) {
                  for (let i = 0; i < filter.length; i += 3) {
                        if (i == 0)
                              query.where(filter[i], filter[i + 1], filter[i + 2])
                        else
                              query.andWhere(filter[i], filter[i + 1], filter[i + 2])
                  }
            }
      }
      else if (filter instanceof Object) {
            query.andWhere(filter)
      }
      if (extraFilter) {
            query.andWhere(extraFilter)
      }
      if (orderby) {
            query.orderBy(orderby, direction)
      }
      let queryString = query.toString()
      return await query
}

exports.getOne = async (table, filter, selectedParameters = '*') => {
      const knex = await getReadKnex()
      let query = knex(table)
            .where({ disabled: false })
            .select(selectedParameters)
            .limit(1)
      if (filter instanceof Array) {
            if (filter.length) {
                  for (let i = 0; i < filter.length; i += 3) {
                        query.andWhere(filter[i], filter[i + 1], filter[i + 2])
                  }
            }
      }
      else {
            query.andWhere(filter)
      }
      let queryString = query.toString()
      const rows = await query
      if (rows.length == 1) {
            rows.forEach(row => delete row.disabled)
            return Promise.resolve(rows[0])
      }
      else if (rows.length > 1) {
            throw `Found ${rows.length} items with filter, ${JSON.stringify(filter)}`
      }
      else {
            return null
      }
}

exports._hasOne = async (table, filter) => {
      const rows = await exports._getAll(table, filter, null, '*', 1)
      return Promise.resolve(!!rows.length)
}

exports.hasOne = async (table, filter) => {
      const rows = await exports.getAll(table, filter, null, '*', 1)
      return Promise.resolve(!!rows.length)
}


exports._getOne = async (table, filter, selectedParameters = '*') => {
      const knex = await getReadKnex()
      let query = knex(table)
            .select(selectedParameters)
            .limit(1)
      if (filter instanceof Array) {
            if (filter.length) {
                  for (let i = 0; i < filter.length; i += 3) {
                        query.andWhere(filter[i], filter[i + 1], filter[i + 2])
                  }
            }
      }
      else {
            query.andWhere(filter)
      }
      let queryString = query.toString()
      const rows = await query
      if (rows.length == 1)
            return Promise.resolve(rows[0])
      if (rows.length == 1) {
            rows.forEach(row => delete row.disabled)
            return Promise.resolve(rows[0])
      }
      else if (rows.length > 1) {
            throw `Found ${rows.length} items with filter, ${JSON.stringify(filter)}`
      }
      else {
            return null
      }
}

exports.searchText = async (table, parameterName, containingText,
      filter = null, selectedParameters = '*', limit = null,
      orderby = null, direction = 'desc') => {

      return await exports.getAll(table, [parameterName, 'like', `%${containingText}%`],
            filter, selectedParameters, limit, orderby, direction)
}

exports.create = async (table, record, transaction = null, existedParametersChecked = null,
      returning = '*') => {
      const knex = await getWriteKnex()
      if (existedParametersChecked) {
            if (!(existedParametersChecked instanceof Object))
                  throw `${existedParametersChecked} must be an object type.`
            const query = knex(table)
                  .where(existedParametersChecked)
                  .select(returning)
                  .limit(1)
            let rows = await query
            if (rows.length) {
                  if (returning === 'id') {
                        return Promise.resolve(rows[0]['id'])
                  }
                  return Promise.resolve(rows[0])
            }
      }
      let query = knex.into(table).insert(record, returning)
      if (transaction) {
            query.transacting(transaction)
      }
      let result = await query
      return Promise.resolve(result[0])
}

exports.update = async (table, filter, updates, transaction = null, returning = '*') => {
      let result = null
      const knex = await getWriteKnex()
      let query = knex(table)
            .where(filter)
            .update(updates, returning)
      if (transaction) {
            query.transacting(transaction)
      }
      result = await query
      return Promise.resolve(result[0])
}

exports.disable = async (table, filter, transaction = null, returning = '*') => {
      return await exports.update(table, filter, { disabled: true }, transaction, returning)
}

exports.destroy = async (table, filter, transaction = null, returning = '*') => {
      let result = null
      const knex = await getWriteKnex()
      let query = knex(table)
            .where({ disabled: true })
            .andWhere(filter)
            .del(returning)
      if (transaction)
            query.transacting(transaction)
      const queryString = query.toString()
      result = await query
      if (result.length > 1)
            return Promise.resolve(result)
      else
            return Promise.resolve(result[0])
}

exports._destroy = async (table, filter, transaction = null, returning = '*') => {
      let result = null
      const knex = await getWriteKnex()
      let query = knex(table)
            .where(filter)
            .del(returning)
      if (transaction)
            query.transacting(transaction)
      const queryString = query.toString()
      result = await query
      if (result.length > 1)
            return Promise.resolve(result)
      else
            return Promise.resolve(result[0])
}
