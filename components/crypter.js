/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  config = require('../config/'),
  crypto = require('crypto');

class Crypter {

  encrypt(data) {
    let cipher = crypto.createCipher('aes-256-ctr', config.get('secretKey'));
    let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(data) {
    let decipher = crypto.createDecipher('aes-256-ctr', config.get('secretKey'));
    let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = new Crypter();