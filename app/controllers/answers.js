/**
 * Module dependencies.
 */

const _ = require('underscore');
const mongoose = require('mongoose');
const async = require('async');
const decodeJWT = require('./middleware/auth').decodeJWT;

const Answer = mongoose.model('Answer');


/**
 * add answer to database
 * @method add
 * @param  {object} req [description]
 * @param  {object} res [description]
 * @return {object} res
 */
exports.add = (req, res) => {
  // Add validation
  if (!req.body.text) {
    return res.status(400).send({
      errors: { text: 'Field is required' }
    });
  }
  const token = req.headers.authorization;
  const decodedToken = decodeJWT(token);
  if (decodedToken === 'unauthenticated') {
    return res.status(401).send({
      errors: { auth: 'Not authorised, please login' }
    });
  }

  const answer = new Answer();
  answer.text = req.text;
  answer.official = true;
  answer.save((err) => {
    if (err) {
      return res.status(500).send(errors => errors);
    }
    return res.status(201).send({
      success: true,
      message: 'Answer added successfully'
    });
  });
};

/**
 * Find answer by id
 */
exports.answer = (req, res, next, id) => {
  Answer.load(id, (err, answer) => {
    if (err) return next(err);
    if (!answer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = answer;
    next();
  });
};

/**
 * Show an answer
 */
exports.show = (req, res) => {
  res.jsonp(req.answer);
};

/**
 * List of Answers
 */
exports.all = (req, res) => {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(answers);
    }
  });
};

/**
 * List of Answers (for Game class)
 */
exports.allAnswersForGame = (cb) => {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      console.log(err);
    } else {
      cb(answers);
    }
  });
};
