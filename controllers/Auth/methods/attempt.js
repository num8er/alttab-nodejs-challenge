/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  uuid = require('uuid'),
  db = require('./../../../components/database'),
  hasher = require('./../../../components/hasher'),
  User = db.model('User'),
  AccessToken = db.model('AccessToken');

module.exports = (req, res) => {
  let
    query = _.pick(req.body, ['username']);
    query.active = true;
    query.deleted = false;
  
  User
    .findOne(query, (error, user) => {
      if (error) {
        return res.status(500)
                  .send({
                    success: false,
                    error: error
                  });
      }

      if (_.isEmpty(user)) {
        return res.status(403)
                  .send({
                    success: false,
                    error: 'Forbidden',
                    message: 'Username and/or password is invalid'
                  });
      }

      if(!hasher.check(req.body.password, user.password)) {
        return res.status(403)
                  .send({
                    success: false,
                    error: 'Forbidden',
                    message: 'Username and/or password is invalid'
                  });
      }

      AccessToken.create(
        {user: user._id},
        (error, result) => {
          if(err) {
            return res.status(500)
                      .send({
                        success: false,
                        error: error
                      });
          }

          res.status(200)
              .send({
                success: true,
                data: user
              });
        });
    });
};