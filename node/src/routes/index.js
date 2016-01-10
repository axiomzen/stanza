(function () {
  'use strict';

  var Poem = require('../controllers/poem.js');

  var Router = function(app) {

    app.get('/ping', function (req, res, next){
      res.status(200).json({
        ping: 'pong'
      });
    });

    app.get('/poems/:emotion', Poem.get);
    app.get('/emotions', Poem.getEmotionList);

    app.get('/', function (req, res) {
      res.render('index', { title: 'Stanza' });
    });

  };

  module.exports = Router;
}());
