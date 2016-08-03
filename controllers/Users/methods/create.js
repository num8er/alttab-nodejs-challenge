/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  db = require('./../../../components/database'),
  hasher = require('./../../../components/hasher'),
  userExistsByEmail = require('./userExistsByEmail'),
  UserModel = db.model('User');

module.exports = (data, callback) => {
  data = _.pick(data, ['email', 'password', 'name']);

  userExistsByEmail(data.email, (err, exists) => {
    if(err) {
      return callback(err);
    }
    
    if(exists) {
      return callback('Account with defined email address exists');
    }
    
    let
      password = data.password;
      data.password = hasher.hash(data.password);
      
    let
      User = new UserModel(data);
      User.save((err, result) => {
        if(err) {
          return callback(err);
        }
        
        result.password = password;
        callback(null, result);
      });
  });
};