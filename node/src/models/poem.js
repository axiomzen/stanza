(function(){
  'use strict';

  var Poem;

  var db        = require('mongoose');
  var Promise   = require('bluebird');
  var _         = require('underscore');

  var poemSchema = new db.Schema({
    type:       { type: String, required: true },
    body:       { type: String, required: true },
    audio:      { type: String, required: true },
    title:      { type: String, required: true },
    themes:     [String],
    emotion:    [db.Schema.Types.Mixed],
    poet:       { type: String, required: true }
  });

  poemSchema.index({ 'emotion.name' : 1});


  poemSchema.statics.getByEmotion = function(emotionName) {
    return Poem.findAsync() //{ 'emotion.name' : emotionName }
      .then(function(poems) {
        return _.sortBy(poems, function(poem) {
          var selected = _.find(poem.emotion, function(emo) {
            return emotionName === emo.name;
          });
          // console.log('selected emotion value', selected.value);
          return selected ? -selected.value : 0;
        });
      })
      .then(function(sortedPoems) {
        return sortedPoems.splice(0, 50);
        // return sortedPoems;
      });
    // return Poem.findAsync({ poet: emotion });
  };

  var Model = db.model('Poem', poemSchema);
  module.exports = Poem = Promise.promisifyAll(Model);
})();
