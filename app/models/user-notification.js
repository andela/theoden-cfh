/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;


/**
 * Notification Schema
 */
const UserNotificationSchema = new Schema({
  userID: {
    type: String
  },
  inviteName: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  gameID: {
    type: String
  },
  gameURL: {
    type: String
  }
});

mongoose.model('UserNotification', UserNotificationSchema);
