/* jshint strict: true */

'use strict';

const
  express = require('express'),
  router = express.Router();

let routes = ['api'];
let aliases = [
  {route: 'api/login', alias: 'auth'}
];

// defining routes of current sub-route
routes.forEach((item) => router.use('/' + item, require('./' + item)));

// defining sub-routes as alias
aliases.forEach((item) => router.use('/' + item.alias, require('./' + item.route)));

module.exports = router;