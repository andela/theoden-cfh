const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Game Schema
 */
const GameSchema = new Schema({
  gameId: {
    type: String
  },
  gameOwner: {
    type: String
  },
  gameWinner: {
    type: String,
    default: '',
    trim: true
  },
  gameRounds: {
    type: String,
    default: '',
    trim: true
  },

  date: Date,

  gamePlayers: []
});

mongoose.model('Game', GameSchema);
