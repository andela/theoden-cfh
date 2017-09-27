const validator = require('validator');

/**
 * 
 */
exports.validatorEmail = email => new Promise((resolve, reject) => {
  if (!validator.isEmail(email)) {
    reject('The email address you provided is not valid');
  } else {
    resolve('Valid');
  }
});
