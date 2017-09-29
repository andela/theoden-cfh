
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const avatars = require('./avatars').all();
const getJWT = require('./middleware/auth').getJWT;
const validator = require('./validators/validators');

mongoose.Promise = global.Promise;

const User = mongoose.model('User');


/**
 * @description Auth callback
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next function
 * @return {object} returns redirect
 */
exports.authCallback = (req, res, next) => {
  res.redirect('/chooseavatars');
};


/**
 * Show login form
 */

exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 */

exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};


/**
 * @description The user can signin and a JWT token is produced
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {object} returns redirect
 */
exports.login = (req, res) => {
  const email = req.body.email;
  if (
    req.body.email &&
    req.body.password
  ) {
    User
      .findOne({
        email: req.body.email
      })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .send({
              success: false,
              message: 'Invalid'
            });
        }
        const password = req.body.password;
        if (bcrypt.compareSync(password, user.hashed_password)) {
          getJWT(user.email, user.username)
            .then((token) => {
              if (token.status === 'Success') {
                res
                  .status(200)
                  .json({
                    success: true,
                    message: 'Welcome to Cards for Humanity, You are now logged in',
                    token: token.token
                  });
              } else {
                res
                  .status(500)
                  .json({
                    success: false,
                    message: 'Something went wrong try again'
                  });
              }
            })
            .catch(error =>
              res
                .status(500)
                .json({
                  success: false,
                  message: error
                })
            );
        } else {
          res
            .status(400)
            .send({
              success: false,
              message: 'Invalid credentials'
            });
        }
      })
      .catch(error => res.status(500).send({
        success: false,
        error
      }))
      .catch(error => res.status(400).send({
        success: false,
        error
      }));
    // if (!req.user) {   res.redirect('/#!/signin?error=invalid'); } else {
    // res.redirect('/#!/app'); }
  } else {
    return res.status(400).send({
      success: false,
      error: 'invalid',
      message: 'Invalid Credentials'
    });
  }
};


/**
 * @description User signs up and signs in with a JWT toke stored in local Storage
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next function
 * @return {object} returns redirect
 */
exports.create = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  if (!email || !name || !password) {
    res.status(400).send('all fields are required');
  } else {
    validator
      .validatorEmail(email)
      .then((validEmail) => {
        if (validEmail === 'Valid') {
          User
            .findOne({
              email: req.body.email
            })
            .then((userExists) => {
              if (userExists) {
                res
                  .status(409)
                  .json({
                    success: false,
                    message: 'This email has already been selected before'
                  });
                // res.redirect('/#!/app');
              } else {
                const user = new User(req.body);
                user.avatar = avatars[user.avatar];
                user.provider = 'local';
                user
                  .save((error, validuser) => {
                    if (error) {
                      res
                        .status(400)
                        .send({
                          success: false,
                          error: error.errors
                        });
                    } else {
                      getJWT(validuser.email, validuser.name)
                        .then((token) => {
                          const credentials = {
                            email: validuser.email,
                            name: validuser.name
                          };
                          res
                            .status(201)
                            .json({
                              success: true,
                              status: 'Success',
                              token: token.token,
                              credentials
                            });
                          // }
                        }).catch((err) => {
                          res
                            .status(500)
                            .json({
                              error: err,
                              message: 'Something went wrong try logging in again'
                            });
                        });
                    }
                  });
              }
            })
            .catch(error => res.status(500).send({
              success: false,
              error: error.errors
            }));
        } else {
          res.status(422).json({
            status: 'Unsuccessful',
            message: 'Try again please'
          });
        }
      })
      .catch(error =>
        res.status(422).send(error));
  }
};


/**
 * Logout
 */

exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */

exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */

exports.checkAvatar = (req, res) => {
  if (req.user && req.user._id) {
    User
      .findOne({_id: req.user._id})
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
 * Create user
 */

exports.create = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
    User
      .findOne({ email: req.body.email })
      .exec((err, existingUser) => {
        if (!existingUser) {
          const user = new User(req.body);
          // Switch the user's avatar index to an actual avatar url
          user.avatar = avatars[user.avatar];
          user.provider = 'local';
          user.save((err) => {
            if (err) {
              return res.render('/#!/signup?error=unknown', {
                errors: err.errors,
                user
              });
            }
            req
              .logIn(user,  (err) => {
                if (err) 
                  return next(err);
                return res.redirect('/#!/');
              });
          });
        } else {
          return res.redirect('/#!/signup?error=existinguser');
        }
      });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

/**
 * Assign avatar to user
 */

exports.avatars =  (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined && /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User
      .findOne({ _id: req.user._id })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User
        .findOne({ _id: req.user._id })
        .exec((err, user)  => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            user
              .donations
              .push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

/**
 *  Show profile
 */

exports.show = (req, res)=> {
  let user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */

exports.me = (req, res)=> {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = (req, res, next, id)=> {
  User
    .findOne({_id: id})
    .exec((err, user) => {
      if (err) 
        return next(err);
      if (!user) 
        return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};
