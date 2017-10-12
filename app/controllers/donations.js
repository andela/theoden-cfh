/**
  * Module dependencies.
  */
const mongoose = require('mongoose'),
  User = mongoose.model('User');
const decodeJWT = require('./middleware/auth').decodeJWT;

/** @description Find user donations
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
module.exports.getDonations = (req, res) => {
  const token = req.params.token;
  const decodetoken = decodeJWT(token);
  const userId = decodetoken.id;
  User.find({ _id: userId }, (err, getDonations) => {
    if (err) {
      return res.status(500).json({ err });
    } if (getDonations === []) {
      return res.status(404).json({ message: 'username does not exist' });
    }
    return res.status(200).json(getDonations.donations);
  });
};
