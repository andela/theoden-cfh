const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// gamelogSchema
const GamelogSchema = new Schema({
  gameId: { type: String, default: '', },
  players: { type: String, default: '' },
  playerId: { type: String, default: '' },
  rounds: { type: String, default: '' },
  winner: { type: String, default: '' },
});

mongoose.model('GameLog', GamelogSchema);
