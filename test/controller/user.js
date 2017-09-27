/**
 * Module dependencies.
 */
const should = require('should');
const app = require('../../server');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const faker = require('faker');
const chai = require('chai');


// Globals
let user;

// The tests
describe('<Unit Test>', () => {
  describe('Model Article:', () => {
    beforeEach((done) => {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      done();
    });
  });

  describe('Method Check User Sign In', () => {
    it('should be able to save whithout problems', done => user.save((err) => {
      should.not.exist(err);
      done();
    }));
  });


  describe('POST /login', () => {
    it('it responds with 401 status code if bad username or password', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send({
          username: faker
            .internet
            .userName(),
          password: faker.internet.password
        })
        .end((err, res) => {
          expect(401);
          done();
        });
    });
  });

  afterEach((done) => {
    done();
  });
});
