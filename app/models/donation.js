const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// donation log Schema
const DonationSchema = new Schema({
  userId: { type: String, default: '' },
  amount: { type: String, default: '', },
  date: { type: Date, default: '' }
});

mongoose.model('Donation', DonationSchema);

