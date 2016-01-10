(function(){
  'use strict';

  var Promise   = require('bluebird');
  var _         = require('underscore');

  var Poem    = require('../models/poem.js');
  var Emotion = require('../models/emotion.js');
  var Config  = require('../config/config.js')();


  var PoemCtrl = {

    getByEmotion: function(req, res) {
      var emotion = req.params.emotion;

      return Poem.getByEmotion(emotion)
        .then(function(poems) {
          res.send(poems);
        });
    },
    playlist: function(req, res){
      var emotion = req.params.emotion;
      return Emotion.getList().then(function(emotionObj){
        return res.render('playlist', { title: 'Stanza', emotion: emotion, emotions: emotionObj[0].emotions});
      });
    },
    home: function(req, res) {
      console.log('getEmotionList called');
      return Emotion.getList().then(function(emotionObj){
        return res.render('index', { title: 'Stanza', emotions: emotionObj[0].emotions});
      });
    },

    getByQuery: function(req, res) {
      var query = req.query.q;

      return Poem.getByTitleOrPoet(query)
        .then(function(poems) {
          res.send(poems);
        });
    },

    getEmotionList: function(req, res) {
      console.log('getEmotionList called');
      return Emotion.getList()
        .then(function(emotionObj){
          if (_.isEmpty(emotionObj)) {
            console.log('getEmotionList emotionObj EMPTY');
            return Emotion.create()
            .then(function(stuff){
              console.log('Emotion.create stuff', stuff);
              return res.send([]);
            });
          }
          return res.send({
            emotions: JSON.parse(JSON.stringify(emotionObj[0].emotions))
          });
        });
    },

  };

  module.exports = PoemCtrl;
})();
