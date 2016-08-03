'use strict';

const
  config = require('./config'),
  path = require('path'),
  fs = require('fs'),
  express = require('express'),
  http = require('http'),
  https = require('https'),
  bodyParser = require('body-parser'),
  cluster = require('./components/cluster'),
  cors = require('cors'),
  app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require(__dirname + '/routes'));

cluster.start(() => {
  // IF HTTP ENABLED LISTEN WITH HTTP MODULE
  if (config.get('app:http:enabled')) {
    let httpServer = http.createServer(app);
    let listenHost = config.get('app:http:host');
    let listenPort = process.env.PORT || config.get('app:http:port');
    httpServer.listen(listenPort, listenHost,
      () => console.log('App listening at http://%s:%s', listenHost, listenPort));
  }
  
  // IF HTTPS ENABLED LISTEN WITH HTTPS MODULE
  if (config.get('app:https:enabled')) {
    let httpsServer = https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'certificates', config.get('app:https:certificate:key'))),
      cert: fs.readFileSync(path.join(__dirname, 'certificates', config.get('app:https:certificate:cert')))
    }, app);
    httpsServer.listen(
      config.get('app:https:port'), config.get('app:https:host'),
      () => console.log('App listening at https://%s:%s', config.get('app:https:host'), config.get('app:https:port')));
  }
});

module.exports = app;