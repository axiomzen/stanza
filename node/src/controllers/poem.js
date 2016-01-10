(function(){
  'use strict';

  var Promise   = require('bluebird');
  var _         = require('underscore');

  var Poem    = require('../models/poem.js');
  var Emotion = require('../models/emotion.js');
  var Config  = require('../config/config.js')();


  var PoemCtrl = {
    get: function(req, res) {
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
  };

  module.exports = PoemCtrl;
})();
