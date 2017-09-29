/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Game = mongoose.model('Game');
const User = mongoose.model('User');


/**
 * Save user game data
 * @param {object} req - request object sent to a route
 * @param {object} res -  response object from the route
 * @returns {object} - returns stored game data
 */
exports.startGame = (req, res) => {
  const game = new Game();

  game.gameOwner = req.body.gameOwner;
  game.gameId = req.params.id;
  game.gameWinner = req.body.gameWinner;
  game.date = new Date();
  game.gamePlayers = req.body.gamePlayers;
  game.gameRounds = req.body.gameRounds;

  User.findOne({ name: req.token.data.name }, (err, user) => {
    if (user === req.body.gameWinner) {
      user.gameWins += 1;
    }
  });
  game.save((error) => {
    if (error) {
      return error;
    }
    res.json(game);
  });
};

exports.getGameHistory = (req, res) => {
  Game.find({ gameOwner: req.token.id }, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'An error occured' });
    } else if (!results) {
      res.status(404).json('No Game found');
    } else {
      res.json({ history: results });
    }
  });
};

exports.getLeaderBoard = (req, res) => {
  User.find({}).sort('-gameWins').exec((err, users) => {
    if (err) {
      res.status(500).send({ error: 'An error occured' });
    } else {
      res.status(200).json({ leaderBoard: users });
    }
  });
};
