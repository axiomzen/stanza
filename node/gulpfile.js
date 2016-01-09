(function() {
  'use strict';

  var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    plugin = require('gulp-load-plugins')(),
    env = process.env.NODE_ENV || 'development';

  gulp.task('clean', plugin.shell.task([
    // 'rm -rf public/',
    'rm -rf built/'
  ]));

  gulp.task('jshint', function() {
    gulp.src([
      '{,*/}*.js',
      'src/{,*/}*.js',
      'js/{,*/}*.js',
      '!js/libs/{,*/}*.js',
      '!FeedMe/{,*/}*.js'
    ])
      .pipe(plugin.plumber(function(err) {
        console.log('\x07');
      }))
      .pipe(plugin.jshint())
      .pipe(plugin.jshint.reporter(plugin.stylish))
      // No JS shall pass (if it is broken)!
      .pipe(plugin.jshint.reporter('fail'));
  });

  /*
  **
  ** DEVELOPMENT
  **
  **/

  gulp.task('nodemon', function() {
    plugin.nodemon({
      script: 'app.js',
      ext: 'js',
      watch: ['app.js', '.'],
      nodeArgs: ['--debug'],
      env: { 'NODE_ENV': env }
    }).on('restart', function() {
      gulp.start('jshint');
    });
  });

  gulp.task('repo:setup', ['npm:install']);

  gulp.task('npm:install', plugin.shell.task([
    'npm prune',
    'npm install'
  ]));

  gulp.task('js', ['jshint'], function() {
    gulp.src(['./js/{,*/}*.js'])
      .pipe(gulp.dest('./public/js'));
  });

  gulp.task('livereload', function() {
    plugin.livereload.changed();
  });

  gulp.task('watch', function() {
    plugin.livereload.listen();
    plugin.watch('**/*.js', ['js', 'livereload']);
  });

  gulp.task('default', function() {
    runSequence('clean', 'repo:setup', ['nodemon', 'watch']);
  });
})();

