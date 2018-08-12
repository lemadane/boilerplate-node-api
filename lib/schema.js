let joi = require('joi');
const joiDate = require('joi-date-extensions');
const joiPhone = require('joi-phone-number-extensions');

joi = joi.extend(joiDate).extend(joiPhone);

const check = (obj, schema) => {
      const { error } = joi.validate(obj, schema);
      if (error)
          throw error;
}

const schema = joi
schema.check = check

module.exports = schema