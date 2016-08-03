/* jshint strict: true */

'use strict';

const _ = require('lodash');

module.exports = (req, res, next) => {
  req.accessToken = _.find([
      req.headers['x-auth-token'],
      req.query.token,
      req.body.token
    ], (token) => !_.isEmpty(token));
  req.accessToken = _.trim(req.accessToken);
 
  if(_.isEmpty(req.accessToken)) {
    return res.status(401);
  }
  
  next();
};