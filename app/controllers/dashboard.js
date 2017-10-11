const mongoose = require('mongoose'),
  GameLog = mongoose.model('GameLog'),
  LeaderBoard = mongoose.model('LeaderBoard'),
  Donation = mongoose.model('Donation');

/** @description Create game log
 * @param {object} gameLogInfo game data 
 * @return {*} void
 */
module.exports.createLog = (gameLogInfo) => {
  if (GameLog) {
    GameLog
      .create(gameLogInfo, (err, response) => {
        if (err) {
          return response.status(500).json({ err });
        }
        return response.status(200).json({ message: 'log created' });
      });
  }
};

/** @description Create leaderboard
 * @param {string} gameWinnerId id of the winner of the game
 * @param {string} gameWinnerName name of the winner of the game
 * @return {*} void
 */
module.exports.createLeaderBoard = (gameWinnerId, gameWinnerName) => {
  if (LeaderBoard) {
    if (gameWinnerId === 'unauthenticated') {
      return false;
    }
    LeaderBoard
      .find({ winnerId: gameWinnerId }, (err, response) => {
        if (err) {
          return response.status(500).json({ err });
        }
        LeaderBoard.update({ winnerId: gameWinnerId }, { winnerId: gameWinnerId, winnerName: gameWinnerName, $inc: { score: 1 } },
          { upsert: true }, (err) => {
            if (err) {
              return response.status(500).json({ err });
            }
          });
      });
  }
};
