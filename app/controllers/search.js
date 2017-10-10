const decodeJWT = require('./middleware/auth').decodeJWT;

const mongoose = require('mongoose');

const User = mongoose.model('User');
const UserFriends = mongoose.model('UserFriends');

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
  /**
 *
 * @param {object} request HTTP request object
 * @param {object} response HTTP response object
 * @returns {object} returns response with response code
 */
  static nameFriends(request, response) {
    const searchQuery = request.query.iDs || null;
    const searchArray = searchQuery.split(',');
    if (searchArray !== null) {
      User
        .find({
          _id: {
            $in: searchArray
          }
        })
        .lean()
        .limit(30)
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
  /**
   * 
   * @param {object} request HTTP request object
   * @param {object} response HTTP response object
   * @returns {object} returns response with response code
   */
  static addFriends(request, response) {
    const friendID = request.query.id || null;
    const userToken = request.query.token || null;

    if (userToken && friendID) {
      const userDetails = decodeJWT(userToken);

      if (userDetails
        && userDetails !== 'unauthenticated') {
        UserFriends.findOneAndUpdate(
          {
            userID: userDetails.id,
          }, {
            $addToSet: {
              friendIDs: friendID
            }
          }
          , {
            upsert: true
          }, (err, doc) => {
            if (err) {
              response.status(500).json({
                status: 'Unsuccessful',
                message: err
              });
            } else {
              response.status(200).json({
                status: 'Successful',
                message: 'Friend Added'
              });
            }
          }
        );
      } else {
        response.status(400).json({
          status: 'Unsuccessful',
          message: 'Invalid User token'
        });
      }
    } else {
      response.status(400).json({
        status: 'Unsuccessful',
        message: 'User/Friend ID'
      });
    }
  }
  /**
   * @description Remove friend from list
   * @param {object} request HTTP request object
   * @param {object} response HTTP response object
   * @returns {object} returns response with response code
   */
  static removeFriend(request, response) {
    const userToken = request.params.userToken || null;
    const friendID = request.query.friendID || null;
    if (userToken !== null && friendID !== null) {
      const decodedToken = decodeJWT(userToken);

      if (decodedToken && decodedToken !== 'unauthenticated') {
        UserFriends.update(
          {
            userID: decodedToken.id,
          }, {
            $pull: {
              friendIDs: friendID
            }
          },
          { safe: true },
          (err, doc) => {
            if (err) {
              response.status(500).json({
                status: 'Unsuccessful',
                message: err
              });
            } else {
              response.status(200).json({
                status: 'Success',
                message: doc
              });
            }
          });
      } else {
        response.status(400).json({
          status: 'Unsuccessful',
          message: 'Invalid Token'
        });
      }
    } else {
      response.status(400).json({
        status: 'Unsuccessful',
        message: 'Incomplete Details'
      });
    }
  }
}
module.exports = SearchUsers;
