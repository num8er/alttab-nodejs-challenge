/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  db = require('./../../../components/database'),
  AccessToken = db.model('AccessToken');

module.exports = AccessToken.findById;