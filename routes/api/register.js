/* jshint strict: true */

'use strict';

const
  express = require('express'),
  router = express.Router(),
  async = require('async'),
  requestHelper = require('../../components/request-helper'),
  controllers = require('../../controllers'),
  Users = controllers.Users,
  AccessTokens = controllers.AccessTokens;

router.post('/',
  requestHelper.validation({
    body: {
      email: "email|required",
      password: "string|required",
      name: "string|required"
    }
  }),
  (req, res) => {
    async.waterfall([
        (done) => Users.create(req.body, done),
        (user, done) => AccessTokens.create(user, done)
      ],
      (error, result) => {
        if(error) {
          return res.status(400).send({
            success: false,
            error: error
          });
        }

        res.status(201).send(result);
      });
  });

module.exports = router;