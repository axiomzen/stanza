'use strict'
var Users = require('../../models/user');
var constants = require('../../helpers/constants');
var url = require('url');

module.exports = {
  userPasswordResetTokenPut: function(req, res, next) {
    Users.getUserById(req.user.id)
      .then(function(user) {

      })
  },
  userPasswordResetTokenDelete: function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (!user) {
        res.status(400).json(info);
      } else {
        res.status(200).json({
          id: user._id,
          email: user.email,
          authToken: info
        });
      }
    })(req, res, next);
  },
  userDelete: function(req, res, next) {
    if (constants.IDRegex.test(req.params.userIdentifier)) {
      Users.deleteUserById(req.params.userIdentifier)
      .then(function(user){
        res.status(200).json(user);
      })
      .catch(function(err){
        res.status(400).json(user);
      });
    } else if (constants.emailRegex.test(req.params.userIdentifier)){
      Users.deleteUserByEmail(req.params.userIdentifier)
        .then(function(user){
          res.status(200).json(user);
        })
        .catch(function(err){
          res.status(400).json(user);
        });
    } else {
      res.status(400).json({
        error: "No user id?"
      });
    }
  },
  userDeleteAll: function(req, res, next) {
    Users.deleteAll()
    .then(function(){
      res.status(200).json({status:"success"});
    })
    .catch(function(err){
      res.status(400).json({error:err});
    });
  }
};