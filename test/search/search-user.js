/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const supertest = require('supertest');
const should = require('should');

const app = require('../../server');

const request = supertest(app);
const User = mongoose.model('User');
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> feat(feature): increase max game invite
=======

>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
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
  describe('When a user tries to search for other users without input', () => {
    it('should display all users in database', (done) => {
      request
        .get('/api/search/users')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(202);
          res.body.status.should.equal('Success');
          done();
        });
    });
  });
  describe('When a user tries to search for other users with input and no user found', () => {
    it('should display all users in database', (done) => {
      request
        .get('/api/search/users?q=invalid+user')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(202);
          res.body.status.should.equal('Success');
          res.body.result.should.eql([]);
          done();
        });
    });
  });
  describe('When a user tries to search for other users with input', () => {
    it('should display all users in database', (done) => {
      request
        .get('/api/search/users?q=full')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(202);
          res.body.status.should.equal('Success');
          done();
        });
    });
  });
});
