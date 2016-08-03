/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  config = require('../config/'),
  crypto = require('crypto'),
  crypter = require('./crypter');

class Hasher {

  md5(data) {
    return crypto.createHash('md5').update(data.toString()).digest('hex');
  }

  secretMd5(data) {
    return this.md5(this.md5(data) + config.get('secretKey'));
  }

  saltedMd5(data, salt) {
    return this.md5(this.md5(data) + salt);
  }
  
  hash(data) {
    return this.secretMd5(crypter.encrypt(data));
  }

  check(plain, hashed) {
    return this.hash(plain) === hashed;
  }

  randomPass() {
    return this.hash(new Date().getTime()).toString().slice(8, 8);
  }
  
  replaceWithStars(string, percentage) {
    let from, to, length, replacement;

    string = _.trim(string);
    length = parseInt(string.length*percentage/100);
    replacement = _.repeat('*', length);
    from = parseInt((string.length - length)/2);
    to = from + length;

    return string.substring(0, from-1) + replacement + string.substring(to-1);
  }
}

module.exports = new Hasher();