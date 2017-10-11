/**
  * Module dependencies.
  */
const mongoose = require('mongoose'),
  GameLog = mongoose.model('GameLog');
const decodeJWT = require('./middleware/auth').decodeJWT;

/** @description retrieve user game log
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
module.exports.getGameLog = (req, res) => {
  const token = req.params.token;
  const decodetoken = decodeJWT(token);
  const userId = decodetoken.id;
  GameLog.find({ playerId: userId }, (err, getGameLog) => {
    if (err) {
      return res.status(500).json({ err });
    } if (getGameLog.length === []) {
      return res.status(404).json({ message: 'user does not exist' });
    }
    return res.status(200).json(getGameLog);
  });
};

/** @description retrieves all game log
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
module.exports.getAllGameLog = (req, res) => {
  GameLog.find({}, (err, getGameLog) => {
    if (err) {
      return res.status(500).json({ err });
    } if (getGameLog === []) {
      return res.status(404).json({ message: 'no game has been played' });
    }
    return res.status(200).json(getGameLog);
  });
};
