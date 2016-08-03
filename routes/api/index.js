/* jshint strict: true */

'use strict';

const
  express = require('express'),
  router = express.Router(),
  requestHelper = require('./../../components/request-helper');

let
  routes = [
    'login',
    'register'
  ],
  guardedRoutes = [
    'profile'
  ];

// defining routes of current sub-route
routes.forEach((item) => router.use('/' + item, require('./' + item)));

// defining routes that will proceed (filtered) through guardFn
let guardFn = requestHelper.isAuthenticated;
guardedRoutes.forEach((item) => router.use('/' + item, guardFn, require('./' + item)));

module.exports = router;