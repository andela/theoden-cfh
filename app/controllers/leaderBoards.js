/**
  * Module dependencies.
  */
const mongoose = require('mongoose'),
  LeaderBoard = mongoose.model('LeaderBoard');

const sortLeader = (leaderBoard) => {
  leaderBoard.sort((a, b) => { return b.score - a.score; });
  return leaderBoard;// eslint-disable 
};

module.exports.create = (req, res) => {
  const leaderboard = new LeaderBoard();
  LeaderBoard.find({ winner: req.body.winner }, (err) => {
    if (err) {
      return res.status(500).json({ message: 'error occured' });
    }
    LeaderBoard.update({ winner: req.body.winner }, { winner: req.body.winner, $inc: { score: 1 } },
      { upsert: true }, (err) => {
        if (err) {
          return res.status(500).json({ message: 'error occured' });
        }
        return res.status(201).json(leaderboard);
      });
  });
};

module.exports.getLeaderBoard = (req, res) => {
  LeaderBoard.find({}, (err, getLeaderBoard) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return res.status(200).json(sortLeader(getLeaderBoard));
  });
};
