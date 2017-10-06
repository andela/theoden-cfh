/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */

exports.play = (req, res) => {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = (req, res) => {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};

exports.setRegion = (req, res) => {
  localStorage.setItem('player_region', req.body.player_region);
};

