/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  db = require('./../../../components/database'),
  User = db.model('User');

module.exports = (id, callback) => {
  User.findOne({
    _id: id,
    active: true,
    deleted: false
  }, (err, result) => {
    if(err) {
      return callback(err);
    }
    
    if(_.isEmpty(result)) {
      return callback('User not found');
    }
    
    callback(null, result);
  });
};