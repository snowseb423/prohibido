const gulp = require('gulp');
const less = require('gulp-less');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

const pages = [
  'index',
  'admin'
];

const types = {
  less: ['./app/less/', './public/css/'], // key: [source, target]
  html: ['./app/html/', './public/'],
  img: ['./app/img/', './public/img/'],
  js: ['./app/js/', './public/js/']
};

// <--------------------------------------->

gulp.task('less', () => {
  return gulp.src(types.less[0] + '*.less')
    .pipe(less())
    .pipe(gulp.dest(types.less[1]));
});
gulp.task('html', () => {
  return gulp.src(types.html[0] + '*.html')
    .pipe(gulp.dest(types.html[1]));
});
gulp.task('img', () => {
  return gulp.src(types.html[0] + '**')
    .pipe(gulp.dest(types.html[1]));
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
gulp.task('clear', () =>{
  return gulp.src('./public/', {read: false})
    .pipe(clean());
});

// <--------------------------------------->

gulp.task('watch-less' , () => {
  gulp.watch(types.less[0] + '**', ['less']);
});
gulp.task('watch-html' , () => {
  gulp.watch(types.html[0] + '**', ['html']);
});
gulp.task('watch-img' , () => {
  gulp.watch(types.img[0] + '**', ['img']);
});
gulp.task('watch-js' , () => {
  gulp.watch(types.js[0] + '**', ['js']);
});

gulp.task('dev', ['watch-less', 'watch-html', 'watch-img', 'watch-js']);
gulp.task('prod', ['less', 'html', 'img', 'js']);
gulp.task('default', ['dev']);