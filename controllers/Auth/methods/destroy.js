/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  db = require('./../../../components/database'),
  AccessToken = db.model('AccessToken');

module.exports = (req, res, callback) => {
  if(!_.isEmpty(req.accessToken)) {
    AccessToken.findByIdAndRemove(req.accessToken, (err) => {});
  }

  if(callback) {
    return callback(req, res);
  }
  
  res.send({
    success: true
  });
};