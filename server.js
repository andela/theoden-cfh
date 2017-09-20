/**
* Module dependencies.
*/
require('dotenv').config();
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    io = require('socket.io');
var dotenv = require('dotenv');

// Load configurations
// if test env, load example file
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';// eslint-disable-line no-multi-assign no-unused-vars
const config = require('./config/config');
const auth = require('./config/middlewares/authorization');
const mongoose = require('mongoose');
/**
* Main application entry file.
* Please note that the order of loading is important.
*/

<<<<<<< HEAD
=======
//Load configurations
//if test env, load example file

dotenv.config();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');
>>>>>>> * create a middle to for authorization validate jwt for each route in middleware/auth

// Bootstrap db connection
mongoose.connect(config.db);
// compartible with mongoose 4.11

// Bootstrap models
const modelsPath = `${__dirname}/app/models`;

const walk = (path) => {
  fs.readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath); // eslint-disable-line global-require import/no-dynamic-require
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);

// bootstrap passport config
require('./config/passport')(passport);

const app = express();

app.use((req, res, next) => {
  next();
});

// express settings
require('./config/express')(app, passport, mongoose);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
const port = config.port;
const server = app.listen(port);
const ioObj = io.listen(server, { log: false });
// game logic handled here
require('./config/socket/socket')(ioObj);

console.log(`Express app started on port ${port}`);

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
// exports =
module.exports = app;

