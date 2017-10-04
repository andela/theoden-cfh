/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const should = require('should');
const app = require('../../server');
const User = mongoose.model('User');
const passport = require('passport');
let user, user2, user3;

describe('POST /api/search/user', () => {
  before((done) => {
    user = new User({
      name: 'user 1 name',
      email: 'test@test.com',
      username: 'user',
      password: 'password'
    });
    user
      .save((err) => {
        if (!err) {
          user2 = new User({
            name: 'user 2 name',
            email: 'test@example.com',
            username: 'user1',
            password: 'password'
          });
          user2
            .save((err) => {
              if (!err) {
                user3 = new User({
                  name: 'user 3 name',
                  email: 'user3@example.com',
                  username: 'user3',
                  password: 'password'
                });
                user3.save((err) => {
                  if (!err) {
                    done();
                  }
                });
              }
            });
        }
      });
  });

  describe('When user is not authenticated and tries to search', () => {
    // app.
  });
});
