/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const avatars = require('./avatars').all();
const getJWT = require('./middleware/auth').getJWT;
const getToken = require('./middleware/auth').getToken;
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
exports.authCallback = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=socialautherror');
  } else {
    getJWT(req.user._id, // eslint-disable-line no-underscore-dangle
      req.email,
      req.user.name)
      .then((token) => {
        res.cookie('token', token.token);
        res.redirect('/#!/');
      });
  }
};


/**
 * @description Show login form
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/chooseavatars');
  }
};

/**
 * @description Show sign up form
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
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
        bcrypt
          .compare(password, user.hashed_password)
          .then((response) => {
            if (response) {
              getJWT(user._id, // eslint-disable-line no-underscore-dangle
                user.email,
                user.username)
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
          });
      })
      .catch(error => res.status(500).send({
        success: false,
        error
      }))
      .catch(error => res.status(400).send({
        success: false,
        error
      }));
  } else {
    return res.status(400).send({
      success: false,
      error: 'invalid',
      message: 'Invalid Credentials'
    });
  }
};


/**
* @description The user can get Token for the Users logging on through social platforms
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {object} returns redirect
 */
exports.getToken = (req, res) => {
  const cookie = getToken(req);
  res.json({
    success: true,
    cookie
  });
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
                      getJWT(validuser._id, // eslint-disable-line no-underscore-dangle
                        validuser.email,
                        validuser.name)
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
 * @description Logout
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {object} returns redirect
 */
exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * @description Session
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {object} returns redirect
 */
exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * @description Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {object} returns redirect
 */
exports.checkAvatar = (req, res) => {
  if (req.user && req.user._id) { // eslint-disable-line no-underscore-dangle
    User
      .findOne({
        _id: req.user._id // eslint-disable-line no-underscore-dangle
      })
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/app');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {

    res.redirect('/');
  }
};


/**
 * @description Assign avatar to user
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {object} returns redirect
 */
exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user
    && req.user._id // eslint-disable-line no-underscore-dangle
    && req.body.avatar !== undefined
    && /\d/.test(req.body.avatar)
    && avatars[req.body.avatar]) {
    User
      .findOne({
        _id: req.user._id // eslint-disable-line no-underscore-dangle
      })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

/**
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) { // eslint-disable-line no-underscore-dangle
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User
        .findOne({
          _id: req.user._id // eslint-disable-line no-underscore-dangle
        })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i += 1) {
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
 * @description Show profile
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * @description Send User
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
exports.me = (req, res) => {
  res.jsonp(req.user || null);
};

/**
 * @description Find user by id
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next next function call
 * @param {number} id user ID
 * @return {*} void
 */
exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) { return next(new Error(`Failed to load User ${id}`)); }
      req.profile = user;
      next();
    });
};
