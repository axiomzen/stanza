(function(){
  'use strict';

  var Poem;

  var db        = require('mongoose');
  var Promise   = require('bluebird');
  var _         = require('underscore');

  var poemSchema = new db.Schema({
    _id:        { type: String, required: true },
    type:       { type: String, required: true },
    body:       { type: String, required: true },
    audio:      { type: String, required: true },
    title:      { type: String, required: true },
    themes:     [String],
    emotion:    [db.Schema.Types.Mixed],
    poet:       { type: String, required: true }
  });

  poemSchema.index({ 'emotion.name' : 1});
  poemSchema.index({ 'poet' : 1});
  poemSchema.index({ 'title' : 1});

  poemSchema.statics.getByEmotion = function(emotionName) {
    return Poem.findAsync() //{ 'emotion.name' : emotionName }
      .then(function(poems) {
        return _.sortBy(poems, function(poem) {
          var selected = _.find(poem.emotion, function(emo) {
            return emotionName === emo.name;
          });
          return selected ? -selected.value : 0;
        });
      })
      .then(function(sortedPoems) {
        return sortedPoems.splice(0, 50);
      });
  };

  poemSchema.statics.getByTitleOrPoet = function(queryStr) {
    var expr = new RegExp('^.*' + queryStr + '.*$', "i");
    var queryByTitle = Poem.find({ title : expr });
    var queryByPoet = Poem.find({ poet : expr });

    return Promise.all([ queryByTitle, queryByPoet ])
      .spread(function(poemsByTitle, poemsByPoet){
        // console.log('Found poems by Title: ', poemsByTitle);
        // console.log('Found poems by Poet: ', poemsByPoet);

        var allPoems = _.union(poemsByPoet, poemsByTitle);
        // console.log('ALL POEMS: ', allPoems);
        return allPoems;
      });
  };

  var Model = db.model('Poem', poemSchema);
  module.exports = Poem = Promise.promisifyAll(Model);
})();
