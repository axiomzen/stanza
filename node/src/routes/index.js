(function () {
  'use strict';

  var Poem = require('../controllers/poem.js');

  var Router = function(app) {

    app.get('/ping', function (req, res, next){
      res.status(200).json({
        ping: 'pong'
      });
    });

    app.get('/playlist/:emotion', Poem.playlist);
    app.get('/poems/:emotion', Poem.get);
    app.get('/', Poem.home);

  };

  module.exports = Router;
}());
