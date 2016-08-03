const
  nconf = require('nconf'),
  path = require('path');

nconf.env().argv();

nconf.file('local', path.join(__dirname, 'config.local.json'));
nconf.file(path.join(__dirname, 'config.json'));

module.exports = nconf;