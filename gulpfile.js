var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eol = require('./');

gulp.task('default', ['eol', 'test']);

gulp.task('eol', function () {
  return gulp.src([
      '**/*.{js,json}',
      '.*',
      '*',
      '!node_modules/**'
    ]).pipe(eol('\n'));
});

gulp.task('test', function () {
    return gulp.src(['test/main.js'])
        .pipe(mocha());
});
