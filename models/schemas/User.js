/* jshint strict: true */

'use strict';

const
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let
  UserMetadataSchema = {
    loginCount: {
      type: Schema.Types.Number,
      default: 0
    },
    hasAgreedEula: {
      type: Schema.Types.Boolean,
      default: false
    }
  };

module.exports = {
  params: {
    collection: 'users'
  },
  fields: {
    _id: {
      type: Schema.Types.String,
      index: {
        unique: true
      },
      default: uuid.v4
    },
    email: {
      type: Schema.Types.String,
      required: true,
      index: true
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    name: 'String',
    active: {
      type: Schema.Types.Boolean,
      default: true
    },
    deleted: {
      type: Schema.Types.Boolean,
      default: false
    },
    createdAt: {
      type: Schema.Types.Date,
      default: Date.now
    },
    updatedAt: 'Date'
  }
};