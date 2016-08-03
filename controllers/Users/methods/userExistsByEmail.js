/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  db = require('./../../../components/database'),
  getByEmail = require('./getByEmail');

module.exports =
  (email, callback) =>
    getByEmail(email, (err, result) => callback(null, !_.isEmpty(result)));