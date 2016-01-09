var Users = require('../models/user');
var jwt = require('jsonwebtoken');
var constants = require('../helpers/constants');
var errorHelper = require('../helpers/errors');
var config = require('../helpers/config');

// Auth layer
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

  // Auth strategies
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Users.getUser(id).then(function(user){
      done(null, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback : true
    }, function(req, email, password, passportDone) {
      Users.validateUserLogin(email.trim(), password)
        .then(function(user){
          var jwtUser = {
            id: user._id,
            email: user.email
          };
          var newToken = jwt.sign(jwtUser, 'alexZimmerman', {
            expiresIn: 60 * 60 * 24 * 365
          });
          passportDone(null, user, newToken);
        })
        .catch(function(err) {
          console.log('Login Error!', err);
          passportDone(err);
        });
    })
  );


  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, passportDone) {

      // Validate
      if (constants.emailRegex.test(email) && password.length > constants.minPasswordLength) {
        Users.getUserByEmail(email)
          .then(function(user){
            if (user) throw 'User Exists';
            return Users.createUser(email, password)
              .then(function(user){
                var jwtUser = {
                  id: user._id,
                  email: user.email
                };
                var newToken = jwt.sign(jwtUser, 'alexZimmerman', {
                  expiresIn: 60 * 60 * 24 * 365
                });
                passportDone(null, user, newToken);
              });
          })
          .catch(function(err) {
            passportDone(err);
          });
        
      } else {
        passportDone(new Error('Password needs to be at least 6 characters long!'));
      }
    }));
};

