const gulp = require('gulp');
const less = require('gulp-less');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

const pages = [
  'index',
  'login',
  'admin'
];

const types = {
  less: ['./app/less/', './views/css/'], // key: [source, target]
  js: ['./app/js/', './views/js/']
};

// <--------------------------------------->

gulp.task('less', () => {
  return gulp.src(types.less[0] + '*.less')
    .pipe(less())
    .pipe(gulp.dest(types.less[1]));
});

gulp.task('js', () => {
  pages.forEach( e => {
    var b = browserify({
      entries: types.js[0] + e + '.js',
      debug: true,
      transform: [babelify.configure({
        presets: ['es2015']
      })]
    });
    return b.bundle()
      .pipe(source( e + '.js' ))
      .pipe(buffer())
      .pipe(gulp.dest(types.js[1]));
  });
});

// <--------------------------------------->

gulp.task('watch-less' , () => {
  gulp.watch(types.less[0] + '**', ['less']);
});
gulp.task('watch-js' , () => {
  gulp.watch(types.js[0] + '**', ['js']);
});

gulp.task('dev', ['less', 'js', 'watch-less', 'watch-js']);
gulp.task('default', ['dev']);
gulp.task('prod', ['less', 'js']);
