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
<<<<<<< HEAD

    User
      .find({})
      .lean()
      .select('name username email')
      .exec((error, result) => {
=======
    User
      .find({}, (error, result) => {
>>>>>>> feat(feature): increase max game invite
        if (error) {
          response.status(400).send({
            status: 'Unsuccessful',
            message: error
          });
        } else if (result) {
<<<<<<< HEAD
          response.status(202).send({
            status: 'Success',
            result
=======
          response.status(200).send({
            status: 'Success',
            result,
>>>>>>> feat(feature): increase max game invite
          });
        }
      });
  }
}
module.exports = SearchUsers;
