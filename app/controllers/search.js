const mongoose = require('mongoose');

const User = mongoose.model('User');
/**
* @description class holds method that searches the dbase for other current users
*/
class SearchUsers {
  /**
  *
  * @param {object} request HTTP request object
  * @param {object} response HTTP response object
  * @returns {object} returns response with response code
  */
  static userSearch(request, response) {
    User
      .find({}, (error, result) => {
        if (error) {
          response.status(400).send({
            status: 'Unsuccessful',
            message: error
          });
        } else if (result) {
          response.status(200).send({
            status: 'Success',
            result,
          });
        }
      });
  }
}
module.exports = SearchUsers;
