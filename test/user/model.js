/**
 * Module dependencies.
 */
<<<<<<< HEAD
const mongoose = require('mongoose');
const should = require('should');

const User = mongoose.model('User');

// Globals
let user;

// The tests
describe('<Unit Test>', () => {
  describe('Model User:', () => {
    before((done) => {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      done();
    });

    describe('Method Save', () => {
      it('should be able to save whithout problems', (done) => {
        user.save((err) => {
          should.not.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save witout name', (done) => {
        user.name = '';
        user.save((err) => {
          should.exist(err);
          done();
        });
      });
    });

=======
let should = require('should'),
  app = require('../../server'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

// Globals
let user;

// The tests
describe('<Unit Test>', () => {
  describe('Model User:', () => {
    before((done) => {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      done();
    });

    describe('Method Save', () => {
      it('should be able to save without problems',
        done => user.save((err) => {
          should.not.exist(err);
          done();
        }));

      it('should be able to show an error when try to save without name', (done) => {
        user.name = '';
        return user.save((err) => {
          should.exist(err);
          done();
        });
      });
    });

>>>>>>> 2ce28fa6eae0393280f35b66ef74a0c971771fb5
    after((done) => {
      done();
    });
  });
});
