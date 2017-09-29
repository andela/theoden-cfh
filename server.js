/**
* Module dependencies.
*/
require('dotenv').config();
const express = require('express'),
  fs = require('fs'),
  passport = require('passport'),
  logger = require('mean-logger'),
  io = require('socket.io');
/**
* Main application entry file.
* Please note that the order of loading is important.
*/

// Load configurations if test env, load example file
const env = process.env.NODE_ENV || 'development',
  config = require('./config/config'),
  auth = require('./config/middlewares/authorization'),
  mongoose = require('mongoose');

// Bootstrap db connection
const db = mongoose.connect(config.db);

// Bootstrap models
const modelsPath = __dirname + '/app/models';
let walk =  (path) => {
  fs
    .readdirSync(path)
    .forEach( (file) => {
      let newPath = path + '/' + file;
      let stat = fs.statSync(newPath);
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      } else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
};
walk(modelsPath);

// bootstrap passport config
require('./config/passport')(passport);

let app = express();

app.use((req, res, next) => {
  next();
});

// express settings
require('./config/express')(app, passport, mongoose);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
let port = config.port;
let server = app.listen(port);
let ioObj = io.listen(server, {log: false});
// game logic handled here
require('./config/socket/socket')(ioObj);

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
 module.exports = app;
