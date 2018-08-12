const moment = require("moment");
const _ = require("lodash");
const log = require("fancy-log");

exports.now = () => moment().format()

exports.jslog = (...args) => {
      if (args.length == 1) {
            log(JSON.stringify(args[0]));
      }
      else if (args) {
            log(`${args[0]}: ${JSON.stringify(args[1])}`);
      }
}

const camelLookup = (row, lookup) => {
      let obj = {};
      for (const [key, value] of Object.entries(lookup)) {
            obj[key] = row[value.toString()];
      }
      return obj;
}

const camelKeys = (row) => _.mapKeys(row, (val, key) => _.camelCase(key))

exports.camel = (row, lookup = null) => {
      if (lookup) {
            return camelLookup(row, lookup);
      }
      else {
            return camelKeys(row);
      }
}


const snakeLookup = (row, lookup) => {
      let obj = {};
      for (const [key, value] of Object.entries(lookup)) {
            obj[value] = row[key];
      }
      return obj;
}

const snakeKeys = (row) => _.mapKeys(row, (val, key) => _.snakeCase(key.toString()))

exports.snake = (row, lookup = null) => {
      if (lookup) {
            return snakeLookup(row, lookup);
      }
      else {
            return snakeKeys(row);
      }
}

exports.round2 = (n) => {
      return _.round(n, 2);
}

exports.round3 = (n) => {
      return _.round(n, 3);
}

exports.round = (n) => {
      return _.round(n, 0);
}

exports.delay = async (msDelay) => new Promise(resolve => {
      setTimeout(() => {
            resolve(true);
      }, msDelay);
});
