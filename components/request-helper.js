/* jshint strict: true */

'use strict';

const
  _ = require('lodash'),
  async = require('async'),
  validator = require('validator'),
  hasher = require('./hasher'),
  db = require('./database'),
  AccessToken = db.model('AccessToken');

const validationRules = {
  default: {
    query: {
      dateFrom: "date:format(YYYY-MM-DDTHH:mm:ssZ)|max:now|optional",
      dateTo: "date:format(YYYY-MM-DDTHH:mm:ssZ)|optional"
    }
  },
  pagination: {
    query: {
      size: "number|optional|default:100",
      from: "number|optional|default:0",
      sortBy: "string|optional",
      sort: "string:valid(asc,desc)|optional|default:asc"
    }
  }
};

function passThroughValidationAttributes(attributes, rules, res) {
  let field, rule, condition, conditions, conditionOptions, c;
  
  if(_.isEmpty(attributes) || _.isEmpty(rules)) {
    return;
  }
  
  for (field in rules) {
    rule = rules[field];
    if (!_.isString(rule)) {
      continue;
    }
    
    conditions = rule.split('|');
    
    if (_.indexOf(conditions, 'required') > -1) {
      if (_.isUndefined(attributes[field])) {
        return res.status(400).send({
          success: false,
          error: field + ' is required'
        });
      }
    }
    else {
      if (_.isUndefined(attributes[field])) {
        continue;
      }
    }
    
    for (c = 0; c <= conditions.length; c++) {
      condition = conditions[c];
      if (!_.isString(condition)) {
        continue;
      }
      conditionOptions = condition.split(':');
      
      if (_.indexOf(conditionOptions, 'string') > -1) {
        attributes[field] = _.trim(attributes[field]);
        if (!_.isString(attributes[field])) {
          return res.status(400).send({
            success: false,
            error: field + ' must be a string'
          });
        }
      }
      
      if (_.indexOf(conditionOptions, 'email') > -1) {
        if (!validator.isEmail(attributes[field])) {
          return res.status(400).send({
            success: false,
            error: field + ' must be an email'
          });
        }
      }
      
      if (
        _.indexOf(conditionOptions, 'num') > -1 ||
        _.indexOf(conditionOptions, 'number') > -1 ||
        _.indexOf(conditionOptions, 'numeric') > -1
      ) {
        if (_.isNaN(attributes[field])) {
          return res.status(400).send({
            success: false,
            error: field + ' must be number'
          });
        }
      }
      
      if (
        _.indexOf(conditionOptions, 'int') > -1 ||
        _.indexOf(conditionOptions, 'integer') > -1
      ) {
        if (!_.isInteger(attributes[field])) {
          return res.status(400).send({
            success: false,
            error: field + ' must be an integer'
          });
        }
      }
    }
  }
}

function passThroughValidationRules(rules, req, res, callback) {
  for(let element of ['params', 'query', 'body']) {
    if(!_.isEmpty(passThroughValidationAttributes(req[element], rules[element], res))) {
      return;
    }
  }
  
  callback();
}

module.exports.validation = (args) => {
  let rules = _.extend({
    params: {},
    body: {},
    query: {}
  }, _.pick(args, ['params', 'body', 'query']));
  
  _.each(validationRules, (validationRule) => {
      rules = _.extend(rules, validationRule);
  });
  
  return (req, res, next) =>
      passThroughValidationRules(rules, req, res, next);
};

module.exports.isAuthenticated = (req, res, next) => {
  if(_.isEmpty(req.accessToken)) {
    return res.status(401).send({
      success: false,
      error: 'Unauthorized'
    });
  }
  
  AccessToken.findById(req.accessToken, (err, result) => {
    if(err || _.isEmpty(result)) {
      return res.status(401).send({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    if(_.isEmpty(result.user)) {
      return res.status(401).send({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    req.user = result.user;
    
    next();
  });
};

module.exports.checkUserAndPassword = (user, password, callback) => {
  if(_.isEmpty(user) || !hasher.check(password, user.password)) {
    return callback('Email and/or password invalid');
  }
  
  callback(null, user);
};