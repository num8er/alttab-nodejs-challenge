/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  config = require('./../config'),
  mongoose = require('mongoose'),
  models = require('./../models');

class ModelInstances {
  constructor() {
    this._instances = [];
  }

  keep(name, instance) {
    this._instances[name] = instance;
  }

  get(name) {
    return this._instances[name] || null;
  }
}

class Database {
  constructor() {
    this._connection = null;
    this._modelInstances = new ModelInstances();
  }

  getConnectionString() {
    return config.get('db:protocol') +
      '://' + config.get('db:user') + ':' + config.get('db:pass') +
      '@' + config.get('db:host') + ':' + config.get('db:port') +
      '/' + config.get('db:name');
  }

  createConnection() {
    let connectionString = this.getConnectionString();
    mongoose.connect(connectionString, {config: {autoIndex: false}});

    this._connection = mongoose.connection;
    this._connection.on('error', (error) => console.error('Database connection error:', error));
    this._connection.once('open', () => console.info('Database connected'));
    return this._connection;
  }

  getDefaultSchemaParams() {
    return {};
  }

  init() {
    if (_.isEmpty(this._connection)) {
      this.createConnection();
    }

    return this;
  }

  initModels() {
    let self = this;

    _.each(models, (model, name) => {
      let fields = model.fields;
      let params = _.extend(self.getDefaultSchemaParams(), model.params);
      let schema = new mongoose.Schema(fields, params);
      let modelInstance = mongoose.model(name, schema);
      self._modelInstances.keep(name, modelInstance);
    });

    return self;
  }

  model(name) {
    return this._modelInstances.get(name);
  }
}

module.exports = (new Database()).init().initModels();