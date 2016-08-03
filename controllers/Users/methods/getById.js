/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  uuid = require('uuid'),
  db = require('./../../../components/database'),
  hasher = require('./../../../components/hasher'),
  User = db.model('User');

module.exports = (req, res) => {
  res.status(501).send('Not implemented');
};