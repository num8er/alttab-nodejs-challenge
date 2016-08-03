/* jshint strict: true */

'use strict';

const
  config = require('../config'),
  cluster = require('cluster'),
  numCPUs = require('os').cpus().length;

module.exports.start = (callable) => {
  let instances = config.get('app:useCluster') ? numCPUs : 1;

  if (instances === 1) {
    return callable();
  }

  if (cluster.isMaster) {
    console.log('Starting', instances, 'instances');
    for (let i = 0; i < instances; i+=1) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => console.log('CLUSTER EXIT', code, signal));
  } else {
    callable();
  }
};