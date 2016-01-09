var Users = require('../../models/user');
var constants = require('../../helpers/constants');
var passport = require('passport');
var url = require('url');

module.exports = {
  // POST /signup
  // Assumes format:
  // {
  //  "email":"example@email.ca",
  //  "password":"aPassword1"
  // }
  signup: function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (!user) {
        res.status(400).json({
          error: err.message
        });
      } else {
        res.status(201).json({
          id: user._id,
          email: user.email,
          authToken: info
        });
      }
    })(req, res, next);
  },
  // POST /login
  // Assumes format:
  // {
  //  "email":"example@email.ca",
  //  "password":"aPassword1"
  // }
  login: function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (!user) {
        res.status(400).json({
          error: err.message
        });
      } else {
        res.status(200).json({
          id: user._id,
          email: user.email,
          authToken: info
        });
      }
    })(req, res, next);
  },
  // GET /users
  // Accepts (and expects) query params: ?email
  get: function(req, res, next) {
    if (!req.query.email) {
      if (req.user) {
        res.status(200).json(req.user);
      }
    } else {
      Users.getUserByEmail(req.query.email.trim())
      .then(function(user){
        res.status(200).json(user);
      });
    }
  },
  // PUT /users
  // Used for updating users. Have to be logged in to access
  put: function(req, res, next) {
    if (req.body) {
      var updatedUser = req.body
      updatedUser.id = req.user.id
      Users.updateUser(updatedUser)
        .then(function(user){
          res.status(200).json(user);
        })
        .catch(function(err){
          console.log("User Put:", err)
          res.status(400).json({
            error: 'Could not update user'
          })
        });
    } else {
      res.status(400);
    }
  },
  // PUT /users/password
  // Used for updating user password. Have to be logged in to access
  passwordPut: function(req, res, next) {
    if (req.body.password && req.body.password.length > constants.minPasswordLength) {

      Users.updateUserPassword(req.user.id, req.body.password)
        .then(function(user){
          res.status(200).json(user);
        })
        .catch(function(err){
          console.log("User Password Put:", err)
          res.status(400).json({
            error: 'Could not update user password'
          })
        });
    } else {
      res.status(400).json({
        error: 'Password needs to be at least 6 characters long!'
      });
    }
  },
  // PUT /users/email
  // Used for updating user email. Have to be logged in to access
  emailPut: function(req, res, next) {
    if (req.body.email) {
      Users.updateUserEmail(req.user.id, req.body.email.trim())
        .then(function(user){
          res.status(200).json(user);
        })
        .catch(function(err){
          console.log("User Email Put:", err)
          res.status(400).json({
            error: 'Could not update user email'
          })
        });
    } else {
      res.status(400);
    }
  },
  // GET /exists?email=:email:
  // Expects one query param, email
  exists: function(req, res, next) {
    if (req.query.email) {
      Users.getUserByEmail(req.query.email.trim())
        .then(function(user){
          if (!user) {
            throw 'No such user';
          }
          res.status(200).json({
            exists: true
          });
        })
        .catch(function(err) {
          console.log("exists error: ", err);
          res.status(200).json({
            exists: false
          });
        });
    } else {
      res.status(400);
    }
  },
  // GET /forgot_password?email=:email:
  // Expects one query param, email
  passwordResetRequest: function(req, res, next) {
    if (!req.query.email) {
      res.status(400).json({
        error: "No email provided"
      });
    } else {
      Users.getUserByEmail(req.query.email.trim())
      .then(function(user){
        return Users.requestPasswordReset(req.user.id);
      })
      .then(function(){
        res.status(204);
      })
      .catch(function(err){
        res.status(400).json({
          error: "Could not find user"
        })
      });
    }
  },
  // GET /reset_password?token=:token:
  // Expects one query param, token
  validateResetToken: function(req, res, next) {
    if (!req.query.token) {
      res.status(400).json({
        error: "400 - Bad Request"
      });
    } else {
      Users.getUserByToken(req.query.token)
      .then(function(user){
        if (user.resetTokenExpiry < Date.now()) {
          res.status(400).json({
            error: "400 - Reset Request Expired"
          });
        } else {
          // res.redirect()
          res.status(200);
        }
      })
      .catch(function(err){
        res.status(400).json({
          error: "400 - Token Invalid"
        })
      });
    }
  },
  // POST /reset_password?token=:token:
  // Expects one query param, token
  resetPassword: function(req, res, next) {
    if (!req.query.token || !req.body.password ) {
      res.status(400).json({
        error: "Bad Request"
      });
    } else {
      Users.getUserByToken(req.query.token)
      .then(function(user){
        if (user.resetTokenExpiry < Date.now()) {
          throw new Error("Reset Request Expired");
        } else {
          return Users.resetPassword(req.user.id, req.body.password);
        }
      })
      .then(function(user){
        res.status(200).json(user);
      })
      .catch(function(err){
        res.status(400).json({
          error: err
        })
      });
    }
  }
};

// bCrypt Helpers
generateHash = function(password) {
  return bCrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
validPassword = function(password, hash) {
  return bCrypt.compareSync(password, hash);
};
