/* jshint strict: true */

'use strict';

const
  express = require('express'),
  router = express.Router(),
  controllers = require('./../../controllers'),
  Users = controllers.Users;

router.get('/', Users.getById);
router.post('/', Users.updateById);

module.exports = router;