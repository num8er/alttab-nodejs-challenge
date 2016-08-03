/* jshint strict: true */

'use strict';

const
  express = require('express'),
  router = express.Router(),
  controllers = require('./../../controllers'),
  Auth = controllers.Auth;

router.post('/', Auth.attempt);

router.delete('/', Auth.destroy);
router.get('/destroy', Auth.destroy);

module.exports = router;