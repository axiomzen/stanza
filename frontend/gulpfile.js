var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var derequire = require('gulp-derequire');

var path = {
  DEST: '../public/',
  SRC: './src/',
};

gulp.task('default', function() {
  return browserify(path.SRC + 'main.js')
    .transform({ global: true }, reactify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(derequire())
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST));
});
