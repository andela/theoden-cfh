/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;

/**
 * Answer Schema
 */
const AnswerSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  official: {
    type: Boolean
  },
  regionId: {
    type: String,
    default: '',
    trim: true
  },

  expansion: {
    type: String,
    default: '',
    trim: true
  }
});

/**
 * Statics
 */
AnswerSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      id: id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('Answer', AnswerSchema);
