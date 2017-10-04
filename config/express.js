
/**
 * Module dependencies.
 */
<<<<<<< HEAD
var express = require('express'),
  mongoStore = require('connect-mongo')(express),
  flash = require('connect-flash'),
  helpers = require('view-helpers'),
  config = require('./config');
=======
const express = require('express');
const mongoStore = require('connect-mongo')(express);
const flash = require('connect-flash');
const helpers = require('view-helpers');
const config = require('./config');
const auth = require('../app/controllers/middleware/auth').authenticate;
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5

module.exports = function (app, passport, mongoose) {
  app.set('showStackError', true);

<<<<<<< HEAD
  //Should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
=======
  // Should be placed before express.static
  app.use(express.compress({
    filter(req, res) {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

<<<<<<< HEAD
  //Setting the fav icon and static folder
  app.use(express.favicon());
  app.use(express.static(config.root + '/public'));

  //Don't use logger for test env
=======
  // Setting the fav icon and static folder
  app.use(express.favicon());
  app.use(express.static(`${config.root}/public`));

  // Don't use logger for test env
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

<<<<<<< HEAD
  //Set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  //Enable jsonp
  app.enable("jsonp callback");

  app.configure(function () {
    //cookieParser should be above session
    app.use(express.cookieParser());

    //bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    //express/mongo session storage
=======
  // Set views path, template engine and default layout
  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'jade');

  // Enable jsonp
  app.enable('jsonp callback');

  app.configure(() => {
    // cookieParser should be above session
    app.use(express.cookieParser());

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // express/mongo session storage
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
    app.use(express.session({
      secret: 'MEAN',
      store: new mongoStore({
        url: config.db,
        collection: 'sessions',
        mongoose_connection: mongoose.connection
      })
    }));

<<<<<<< HEAD
    //connect flash for flash messages
    app.use(flash());

    //dynamic helpers
    app.use(helpers(config.app.name));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //routes should be at the last
    app.use(app.router);

    //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
      //Treat as 404
      if (~err.message.indexOf('not found')) return next();

      //Log it
      console.error(err.stack);

      //Error page
      res.status(500).render('500', {
        error: err.stack
      });
    });

    //Assume 404 since no middleware responded
    app.use(function (req, res, next) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });

=======
    // connect flash for flash messages
    app.use(flash());

    // dynamic helpers
    app.use(helpers(config.app.name));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api', auth);


    // routes should be at the last
    app.use(app.router);

    // Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use((err, req, res, next) => {
      // Treat as 404
      if (~err.message.indexOf('not found')) return next();

      // Log it
      console.error(err.stack);

      // Error page
      res.status(500).render('500', {
        error: err.stack
      });
    });

    // Assume 404 since no middleware responded
    app.use((req, res, next) => {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });

    // dynamic helpers
    app.use(helpers(config.app.name));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // routes should be at the last
    app.use(app.router);

    // Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use((err, req, res, next) => {
      // Treat as 404
      if (~err.message.indexOf('not found')) return next();

      // Log it
      console.error(err.stack);

      // Error page
      res.status(500).render('500', {
        error: err.stack
      });
    });

    // Assume 404 since no middleware responded
    app.use((req, res, next) => {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  });
};

