/* jshint strict: true */

'use strict';

const _ = require('lodash');

module.exports = (req, res, next) => {
  if(req.headers.authorization) {
    if(req.headers.authorization.split(' ')[0] == 'Bearer') {
      req.accessToken = req.headers.authorization.split(' ')[1];
      return next();
    }
  }
  
  req.accessToken = _.find([
      req.headers['x-auth-token'],
      req.query.token,
      req.body.token
    ], (token) => !_.isEmpty(token));
  req.accessToken = _.trim(req.accessToken);
  
  if(_.isEmpty(req.accessToken)) {
    delete req.accessToken;
  }
  
  next();
};