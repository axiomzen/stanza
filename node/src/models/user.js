'use strict'

// var MongoClient = require('mongodb').MongoClient
// var db = require('../helpers/config').db;
var constants = require('../helpers/constants');
var db = require('./db');
var jwt = require('jsonwebtoken');
var errorHelper = require('../helpers/errors');
var promise  = require('bluebird');
var ObjectId = require('mongodb').ObjectID;

// Auth layer
var passport = require('passport');
var bCrypt = require('bcrypt-nodejs');


module.exports = (function(){
  function getUser(query) {
    return db.getClient()
    .then( function(client) {
      var users = client.collection('users');
      return users.findOne(query)
      .then(function(user){
        client.close();
        return user;
      })
      .catch(function(err){
        console.log('getUser error', err);
      });
    });
  };
  function getUserByEmail (email) {
    return getUser({
      email: { $regex: new RegExp('^' + email.toLowerCase(), "i") } 
    });
  }
  return {
    createUser: function(email, password) {
      return db.getClient()
      .then( function(client) {
        // if (!password || password.length < constants.minPasswordLength ) {
        //   throw {error: 'Password too short' };
        // }

        var hashPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        var users = client.collection('users');
        return users.insertOne({
          email: email,
          hash: hashPassword
        })
        .then(function(results){
          client.close();
          return results.ops[0];
        }).
        catch(function(err) {
          console.log("Error creating user ",err);
        });
      });
    },
    validateUserLogin: function(email, password) {
      return db.getClient()
      .then( function(client) {
        // var hashPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        var users = client.collection('users');
        return getUserByEmail(email)
        .then(function(user){
          client.close();
          if (!user) {
            throw 'Could not find user';
          }
          return bCrypt.compareSync(password, user.hash);
        });
      });
    },
    getUserById: function(userId){
      return getUser({
        _id: userId
      });
    },
    getUserByEmail: getUserByEmail,
    getUserByToken: function(token) {
      return getUser({
        reset_token: token
      });
    },
    updateUser: function(user) {
      var userId = user.id;
      delete user.id;
      delete user.email;
      delete user.password;
      delete user.hash;
      return db.getClient()
      .then( function(client) {
        var users = client.collection('users');
        return users.findOneAndUpdate(
          {_id:  new ObjectId(userId)},
          {$set: user},
          {returnOriginal: false})
          .then(function(result){
            client.close();
            return result.value;
          })
          .catch(function(err) {
            console.log('updateUser error: ', err)
          });
      });
    },
    updateUserPassword: function(userId, password) {
      return db.getClient()
        .then( function(client) {
          var hashPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
          var users = client.collection('users');
          return users.findOneAndUpdate({
            _id:  new ObjectId(userId)
          },{
            $set:{
              hash: hashPassword
            }
          },{
            returnOriginal: false
          })
          .then(function(result){
            client.close();
            return result.value;
          })
          .catch(function(err) {
            console.log('updateUserPassword error: ', err)
          });
        });

    },
    updateUserEmail: function(userId, email) {
      return db.getClient()
        .then( function(client) {
          var users = client.collection('users');
          return users.findOneAndUpdate({
            _id:  new ObjectId(userId)
          },{
            $set:{
              email: email
            }
          },{
            returnOriginal: false
          })
          .then(function(result){
            client.close();
            return result.value;
          })
          .catch(function(err) {
            console.log('updateUserEmail error: ', err)
          });
        });
    },
    deleteUserById: function(userId) {
      return db.getClient()
        .then( function(client) {
          var users = client.collection('users');
          return users.deleteOne({
            _id: userId
          })
        })
        .then(function(results){
          console.log("user deleted");
        }).catch(function( err){
          console.log("deleteUserById error: ", err);
        });
    },
    deleteUserByEmail: function(email) {
      return db.getClient()
        .then( function(client) {
          var users = client.collection('users');
          return users.deleteOne({
            email: email
          })
        })
        .then(function(results){
          // console.log(results);
        }).catch(function(err){
          console.log("deleteUserByEmail error: ",err);
        });
    },
    deleteAll: function() {
      return db.getClient()
        .then( function(client) {
          var users = client.collection('users');
          return users.drop()
        })
        .then(function(results){
          // console.log(results);
        }).catch(function(err){
          console.log("deleteAll error: ",err);
        });
    },
    requestPasswordReset: function(email) {
      return db.getClient()
        .then( function(client) {
          // var hashPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
          var users = client.collection('users');
          return users.updateOne({
            email: email
          },{
            $set:{
              reset_token: require('crypto').randomBytes(constants.resetTokenLength).toString('hex'),
              reset_token_expiry: new Date()
            }
          })
          .then(function(results){
            var user = results.ops[0];
            client.close();

            return user;
          })
          .catch(function(err){
            console.log('requestPasswordReset error', err);
          });
        });
    }
  };
}());
