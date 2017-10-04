<<<<<<< HEAD
var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GitHubStrategy = require('passport-github').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  User = mongoose.model('User'),
  config = require('./config');
=======
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5

const User = mongoose.model('User');
const config = require('./config');

<<<<<<< HEAD
module.exports = function (passport) {
  //Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, function (err, user) {
=======

module.exports = function (passport) {
  // Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id
    }, (err, user) => {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
      user.email = null;
      user.facebook = null;
      user.hashed_password = null;
      done(err, user);
    });
  });
<<<<<<< HEAD

  //Use local strategy
=======


  // Use local strategy
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
<<<<<<< HEAD
    function (email, password, done) {
      User.findOne({
        email: email
      }, function (err, user) {
=======
    ((email, password, done) => {
      User.findOne({
        email
      }, (err, user) => {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
<<<<<<< HEAD
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
=======
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
        user.email = null;
        user.hashed_password = null;
        return done(null, user);
      });
<<<<<<< HEAD
    }
  ));

  //Use twitter strategy
=======
    })
  ));

  // Use twitter strategy
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY || config.twitter.clientID,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL
  },
<<<<<<< HEAD
    function (token, tokenSecret, profile, done) {
      User.findOne({
        'twitter.id_str': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            provider: 'twitter',
            twitter: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

  //Use facebook strategy
=======
    ((token, tokenSecret, profile, done) => {
      User.findOne({
        'twitter.id_str': profile.id
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            provider: 'twitter',
            twitter: profile._json
          });
          user.save((err) => {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    })
  ));

  // Use facebook strategy
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID || config.facebook.clientID,
    clientSecret: process.env.FB_CLIENT_SECRET || config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
<<<<<<< HEAD
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log(profile);
          user = new User({
            name: profile.displayName,
            email: (profile.emails && profile.emails[0].value) || '',
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            user.facebook = null;
            return done(err, user);
          });
        } else {
          user.facebook = null;
          return done(err, user);
        }
      });
    }
  ));

  //Use github strategy
=======
    ((accessToken, refreshToken, profile, done) => {
      User.findOne({
        'facebook.id': profile.id
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log(profile);
          user = new User({
            name: profile.displayName,
            email: (profile.emails && profile.emails[0].value) || '',
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          });
          user.save((err) => {
            if (err) console.log(err);
            user.facebook = null;
            return done(err, user);
          });
        } else {
          user.facebook = null;
          return done(err, user);
        }
      });
    })
  ));

  // Use github strategy
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || config.github.clientID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET || config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
<<<<<<< HEAD
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'github.id': profile.id
      }, function (err, user) {
=======
    ((accessToken, refreshToken, profile, done) => {
      User.findOne({
        'github.id': profile.id
      }, (err, user) => {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'github',
            github: profile._json
          });
<<<<<<< HEAD
          user.save(function (err) {
=======
          user.save((err) => {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
<<<<<<< HEAD
    }
  ));

  //Use google strategy
=======
    })
  ));

  // Use google strategy
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || config.google.clientID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
<<<<<<< HEAD
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function (err, user) {
=======
    ((accessToken, refreshToken, profile, done) => {
      User.findOne({
        'google.id': profile.id
      }, (err, user) => {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
<<<<<<< HEAD
          user.save(function (err) {
=======
          user.save((err) => {
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
<<<<<<< HEAD
    }
=======
    })
>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
  ));
};
