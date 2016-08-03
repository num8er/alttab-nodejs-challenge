/* jshint strict: true */

'use strict';

const
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = {
  params: {
    collection: 'access_tokens'
  },
  fields: {
    _id: {
      type: Schema.Types.String,
      index: {
        unique: true
      },
      default: uuid.v4
    },
    user: {
      type: Schema.Types.String,
      ref: 'User',
      index: true
    },
    payload: 'Mixed',
    createdAt: {
      type: Schema.Types.Date,
      default: Date.now
    }
  }
};