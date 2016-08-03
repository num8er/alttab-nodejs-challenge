/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  db = require('./../../../components/database'),
  AccessToken = db.model('AccessToken');

module.exports =
  (user, callback) =>
    AccessToken.create(
      {user: user._id},
      (error, result) => {
        if(error) {
          return callback(error);
        }
        
        callback(null, {
          token: result._id,
          user: user._id
        });
      });