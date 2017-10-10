/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * User Friends Schema
 */
const UserFriendsSchema = new Schema({
  userID: {
    type: String
  },
  friendIDs: {
    type: Array,
    default: false
  }
});

mongoose.model('UserFriends', UserFriendsSchema);
