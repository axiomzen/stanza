(function(){
  'use strict';

  var express = require('express');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var mongoose = require('mongoose');

  var config = require('./src/config/config.js')();
  var db = require('./src/config/db');

  var app = express();

  var env = process.env.NODE_ENV || 'development';

  /**
   * Connect to MongoDB.
   */
  mongoose.set('debug', true); // Log all queries that mongoose fire in the application
  mongoose.connect(db.url);
  mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  });

  app.set('port', process.env.PORT || 3000);
  app.use(env === 'development' ? logger('dev') : logger('default'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  require('./src/routes')(app);

  // For the Merchant Queue page
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'jade');

  // For static CSS / JS assets
  app.use('/static', express.static('public'));

  /// Error handlers
  app.use(function (err, req, res, next) {
    console.error('url: %s, stack: %s', req.url ,err.stack);
    next(err);
  });

  // Development error handler
  // Will print stacktrace
  if (env === 'development' || env === 'staging') {
    console.log('using dev/staging error handler');
    app.use(function(err, req, res, next) {
      var status = err.status || 500;
      res.status(status);
      res.send({
        error: err,
        status: status
      });
      return;
    });
  }

  // Production error handler
  // No stacktraces leaked to user
  app.use(function(err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    res.send({
      error: err,
      status: status
    });
    return;
  });

  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    // console.log('Config:', config);
  });
})();
