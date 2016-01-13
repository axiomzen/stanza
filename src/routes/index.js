(function () {
  'use strict';

  var Poem = require('../controllers/poem.js');

  var Router = function(app) {

    app.get('/ping', function (req, res, next){
      res.status(200).json({
        ping: 'pong'
      });
    });

    app.get('/api/poems/:emotion', Poem.getByEmotion);
    app.get('/api/poems', Poem.getByQuery);
    app.get('/api/emotions', Poem.getEmotionList);

    app.get('*', Poem.home);
  };

  module.exports = Router;
}());
