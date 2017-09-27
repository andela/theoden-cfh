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
    const searchQuery = request.query.q || null;

    if (searchQuery === null) {
      User
        .find({})
        .lean()
        .limit(10)
        .select('name username email')
        .exec((error, result) => {
          if (result) {
            response.status(202).send({
              status: 'Success',
              result
            });
          }
        });
    } else {
      User
        .find({
          $or: [
            {
              username: {
                $regex: `.*${searchQuery}.*`,
                $options: 'isx'
              },
            }, {
              name: {
                $regex: `.*${searchQuery}.*`,
                $options: 'is'
              }
            }
          ]
        })
        .lean()
        .limit(10)
        .select('name username email')
        .exec((error, result) => {
          if (result) {
            response.status(202).send({
              status: 'Success',
              result
            });
          }
        });
    }
  }
}
module.exports = SearchUsers;
