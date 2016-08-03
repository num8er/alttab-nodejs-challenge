/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  express = require('express'),
  router = express.Router(),
  controllers = require('./../../controllers'),
  Users = controllers.Users;

router.get('/', (req, res) => {
  Users.getById(req.user, (error, result) => {
    if(error) {
      return res.status(400).send({
        success: false,
        error: error
      });
    }
    
    result = _.pick(result, ['_id', 'email', 'name']);
    res.send(result);
  });
});
module.exports = router;