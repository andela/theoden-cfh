/**
 * Module dependencies.
 */
const _ = require('underscore');
const mongoose = require('mongoose');
const decodeJWT = require('./middleware/auth').decodeJWT;
// const async = require('async');
const Question = mongoose.model('Question');

/**
  * add question to database
  * @method add
  * @param  {object} req [description]
  * @param  {object} res [description]
  * @return {object} res
  */
exports.add = (req, res) => {
  // Add validations
  const err = {};
  if (!req.body.text && !req.body.numAnswers) {
    return res.status(400).send({
      errors: { all: 'All fields are required' }
    });
  }

  if (!req.body.text) {
    err.text = 'Field is required';
  }

  if (!req.body.numAnswers || !Number.isInteger(parseInt(req.body.numAnswers, 10)) ||
     Number.parseInt(req.body.numAnswers, 10) < 1 || Number.parseInt(req.body.numAnswers, 10) > 2) {
    err.numAnswers = 'Invalid number of answers, please choose either 1 or 2';
  }

  if (!req.body.regionId ||
     parseInt(req.body.regionId, 10) < 0 || parseInt(req.body.reqionId, 10) > 4) {
    err.region = 'Invalid region selected';
  }

  if (Object.keys(err).length > 0) {
    return res.status(400).send({ errors: err });
  }

  const token = req.headers.authorization;
  const decodedToken = decodeJWT(token);
  if (decodedToken === 'unauthenticated') {
    return res.status(401).send({
      errors: { auth: 'Not authorised, please login' }
    });
  }

  const question = new Question();
  question.text = req.body.text;
  question.numAnswers = req.body.numAnswers;
  question.regionId = req.body.regionId;
  question.official = true;
  question.save((err) => {
    if (err) {
      return res.status(500).send(errors => errors);
    }

    return res.status(201).send({
      success: true,
      message: 'Question added successfully'
    });
  });
};

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
