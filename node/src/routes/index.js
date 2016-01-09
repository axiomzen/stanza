(function () {
  'use strict';

  var express = require('express');
  var basicAuth = require('basic-auth');
  var jwt = require('jsonwebtoken');
  var users = require('../routes/v1/users');
  var constants = require('../helpers/constants');
  var errors = require('../helpers/errors');

  var InitRouter = function(app, passport) {

    // Non-Gated
    // =========
    app.get('/v1/users/reset_password', users.validateResetToken);
    app.post('/v1/users/reset_password', users.resetPassword);

    app.get('/ping', function (req, res, next){
      res.status(200).json({
        ping: 'pong'
      });
    });

    // API Token Gated
    // ===============
    // Gate all basic endpoints with an api token
    app.use('/v1/*', function (req, res, next) {
      var credentials = basicAuth(req);
      if (!credentials || !credentials.name) {
        res.status(401).json({
          error: 'Not Authorized'
        });
        return;
      }

      // var apiToken = credentials.name;
      // if (constants.apiTokens.indexOf(apiToken) > -1 || constants.testToken === apiToken) {
      //   next();
      // } else {
      //   res.status(401).json({
      //     error: 'Not Authorized'
      //   });
      // }
    });

    // User routes
    // ===========

    // User Gating
    // -----------
    app.post('/v1/users/login', users.login);
    app.post('/v1/users/signup', users.signup);

    // User
    app.get('/v1/users/exists', users.exists);
    app.get('/v1/users/forgot_password', users.passwordResetRequest);

    // User Gated
    // ==========

    // Gate all future user endpoints with the isAuthenticated middle ware
    app.use('/v1/users*', function (req, res, next) {
      var authToken = req.headers['x-authentication-token'];
      try {
        jwt.verify(authToken, 'alexZimmerman',function(err, decodedUser) {
          if (err){
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
            if (err.name === 'TokenExpiredError') {

              res.status(440).json({
                error: "Token expired, please login again."
              });
            } else {
              res.status(401).json({
                error: "Invalid authentication token, please login again."
              });
            }
            return;
          } else {
            // Set decoded user to req.user
            req.user = decodedUser;
            next();
          }
        });
      } catch(err) {
        res.status(401).json({
          error: "Invalid authentication token, please login again."
        });
      }
    });
    var userRouter = express.Router();
    userRouter.route('/')
      .get(users.get)
      .put(users.put);
    userRouter.put('/exists', users.exists);
    userRouter.put('/password', users.passwordPut);
    userRouter.put('/email', users.emailPut);
    userRouter.put('/signup', users.emailPut);

    app.use('/v1/users', userRouter);

    // if (process.env.NODE_ENV === 'test') {
    //   var testRouter = express.Router();
    //   var tester = require('../routes/v1/testers');

    //   testRouter.put('/users/password-reset', tester.userPasswordResetTokenPut);
    //   testRouter.delete('/users/password-reset/:userId('+constants.IDRegex+')', tester.userPasswordResetTokenDelete);
    //   testRouter.delete('/users/:userIdentifier', tester.userDelete);
    //   testRouter.delete('/users', tester.userDeleteAll);
    //   app.use('/v1/test/*', function (req, res, next) {
    //     var credentials = basicAuth(req);
    //     if (!credentials || !credentials.name) {
    //       res.status(401).json({
    //         error: 'Not Authorized'
    //       });
    //       return;
    //     }

    //     var apiToken = credentials.name;
    //     if (constants.testToken === apiToken) {
    //       next();
    //     } else {
    //       res.status(401).json({
    //         error: 'Not Authorized'
    //       });
    //     }
    //   })
    //   app.use('/v1/test', testRouter);
    // }



  };

  module.exports = InitRouter;
}());
