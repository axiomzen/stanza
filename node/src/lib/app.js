var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var app     = express();
var passport = require('passport');
// var Promise = require("bluebird");
// Promise.promisifyAll(require("mongodb"));


// Express sessions options
app.use(expressSession({
  secret: 'alexZimmerman',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('../helpers/passport')(passport);
require('./parser')(app);
require('../routes')(app, passport);

module.exports = app;
