'use strict'

var MongoClient = require('mongodb').MongoClient
var db = require('../helpers/config').db;

module.exports = {
  getClient: function() {
    if (process.env.NODE_ENV === 'test') {
      if (!endsWith(db, 'test-db') && !endsWith(db,'/')){
        db = db + '-test-db';
      }
    }
    return MongoClient.connect(db);
  }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}