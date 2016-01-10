(function(){
  'use strict';

  var Emotion;

  var db        = require('mongoose');
  var Promise   = require('bluebird');
  var _         = require('underscore');

  var emotionSchema = new db.Schema({
    emotions:    [String]
  });

  emotionSchema.statics.getList = function() {
    return Emotion.findAsync({});
  };

  emotionSchema.statics.create = function() {
    console.log('emotionSchema create called');
    var obj = new Emotion({
      emotions: []
    });

    console.log('emotionSchema create obj ', obj);

    return Promise.resolve(obj.save())
      .then(function() {
        return [];
      })
      .catch(function(error) {
        console.log('Err creating Emotion Object', err);
      });
  };

  var Model = db.model('Emotion', emotionSchema);
  module.exports = Emotion = Promise.promisifyAll(Model);
})();
