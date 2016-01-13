(function () {
  'use strict';

  var Poem = require('../controllers/poem.js');

  var Router = function(app) {

    app.get('/ping', function (req, res, next){
      res.status(200).json({
        ping: 'pong'
      });
    });

    app.get('/poems/:emotion', Poem.getByEmotion);
    app.get('/poems', Poem.getByQuery);
    app.get('/emotions', Poem.getEmotionList);
    
    app.get('*', Poem.home);
  };

  module.exports = Router;
}());
