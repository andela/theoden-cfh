/**
 * Module dependencies.
 */
<<<<<<< HEAD
const _ = require('underscore');
const mongoose = require('mongoose');
// const async = require('async');
const Question = mongoose.model('Question');
=======
var mongoose = require('mongoose'),
  async = require('async'),
  Question = mongoose.model('Question'),
  _ = require('underscore');
>>>>>>> feat(feature): increase max game invite


/**
 * @description Find question by id
 * @param {object} req HTTP Request Object
 * @param {object} res HTTP Response Object
 * @param {function} next return function
 * @param {*} id
 * @return {*} void
 */
exports.question = (req, res, next, id) => {
  Question.load(id, (err, question) => {
    if (err) return next(err);
    if (!question) return next(new Error(`Failed to load question ${id}`));
    req.question = question;
    next();
  });
};

/**
 * Show an question
 */

exports.show = (req, res) => {
  res.jsonp(req.question);
};

/**
 * @description List of Questions
 * @param {object} req HTTP Request Object
 * @param {object} res HTTP Response Object
 * @return {*} void
 */

exports.all = (req, res) => {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec((err, questions) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(questions);
    }
  });
};

/**
 * List of Questions (for Game class)
 * @param {*} cb
 * @return {function} cb
 */
exports.allQuestionsForGame = (cb) => {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec((err, questions) => {
    if (err) {
      console.log(err);
    } else {
      cb(questions);
    }
  });
};
