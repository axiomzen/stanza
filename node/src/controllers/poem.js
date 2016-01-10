(function(){
  'use strict';

  var Promise   = require('bluebird');
  var _         = require('underscore');

  var Poem   = require('../models/poem.js');
  var Config = require('../config/config.js')();


  var PoemCtrl = {
    get: function(req, res) {
      var emotion = req.params.emotion;

      return Poem.getByEmotion(emotion)
        .then(function(poems) {
          res.status(201).send(poems);
        });
    },
  };

  module.exports = PoemCtrl;
})();
