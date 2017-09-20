/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');
const avatars = require('./avatars').all();
const getJWT = require('./middleware/auth').getJWT;


/**
 * Auth callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/chooseavatars');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
  const email = req.body.email;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          success: false,
          message: `${req.body.email} does not exist in the database`,
        });
      }
      const password = req.body.password;
      console.log((bcrypt.compareSync(password, user.hashed_password)));
      if (bcrypt.compareSync(password, user.hashed_password)) {
        const token = getJWT(
          user._id,
          user.email,
          user.username
        );
        res.status(200).json({
          success: true,
          token,
          message: 'Welcome to Cards for Humanity, You are now logged in'
        });
      } else {
        res.status(400).send({
          success: false,
          message: 'Your password is wrong'
        });
      }
    }).catch(error => res.status(500).send({
      success: false,
      error,
    }))
    .catch(error => res.status(400).send({
      success: false,
      error,
    }));
  // if (!req.user) {
  //   res.redirect('/#!/signin?error=invalid');
  // } else {
  //   res.redirect('/#!/app');
  // }
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const name = req.body.name;
  const hashed_password = req.body.password;

  User.findOne({ username: req.body.username })
    .then((userExists) => {
      if (userExists && userExists.username === username) {
        res.status(409).json({
          success: false,
          message: 'Your username needs to be unique',
        });
        // res.redirect('/#!/app');
        return;
      }
      const user = new User(req.body);
      user.avatar = avatars[user.avatar];
      user.provider = 'local';
      return user.save()
        .then((user) => {
          const token = getJWT(
            user._id,
            user.email,
            user.username
          );
          res.status(201).json({
            success: true,
            token,
            name,
            email,
            message: 'Welcome to Cards Against Humanity',
            name
          });
        })
        .catch((error) => {
          res.status(400).send({
            success: false,
            error: 'You have encountered an error'
          });
          console.log(error);
        });
    }).catch(error => res.status(500).send({
      success: false,
      error }));

  // if (!req.user) {
  //   res.redirect('/#!/signup');
  // } else {

  // }
};


/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/** 
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
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
exports.create = function (req, res) {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
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
          req.logIn(user, (err) => {
            if (err) return next(err);
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
exports.avatars = function (req, res) {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = function (req, res) {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
        // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            user.donations.push(req.body);
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
exports.show = function (req, res) {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};


// getUser(req, res) {
//   const username = req.body.username;
//   const password = req.body.password;
//   return User.findOne({ where: { username } }).then((user) => {
//     if (!user) {
//       res.status(400).send({
//         success: false,
//         message: 'user does not exist',
//       });
//       return;
//     }
//     bcrypt.compare(password, user.password).then((result) => {
//       if (!result) {
//         res.status(400).send({
//           success: false,
//           message: 'wrong username and password combination',
//         });
//       } else {
//         const token = getJWT(
//           user.id,
//           user.username,
//           user.email,
//           user.isAdmin
//         );
//         const { id, firstName, lastName, isAdmin } = user;
//         res.status(200).json({
//           success: true, token, id, firstName, lastName, isAdmin
//         });
//       }
//     }).catch(error => res.status(500).send({
//       success: false,
//       error,
//     }));
//   }).catch(error => res.status(400).send({
//     success: false,
//     error,
//   }));
// },
