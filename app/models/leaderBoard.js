const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// leaderBoardSchema
const LeaderBoardSchema = new Schema({
  score: { type: Number, default: 0 },
  winnerName: { type: String, default: '' },
  winnerId: { type: String, default: '' }
});

mongoose.model('LeaderBoard', LeaderBoardSchema);
