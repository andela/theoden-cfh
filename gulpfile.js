const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const bower = require('gulp-bower');
const browserSync = require('browser-sync');

gulp.task('watch', () => {
  gulp.watch('app/views/**', browserSync.reload());
  gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload());
  gulp.watch('public/views/**', browserSync.reload());
  gulp.watch('public/css/**/*scss', ['sass']);
  gulp.watch('public/css/**', browserSync.reload());
});

gulp.task('lint', () => {
  gulp.src(['gulpfile.js', 'public/js/**/*.js', 'app/**/*.js', 'test/**/*.js'])
    .pipe(eslint('.eslintrc'));
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    watch: ['app', 'config'],
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    env: {
      PORT: 3000
    }
  });
});

gulp.task('concurrent', ['nodemon', 'watch']);

gulp.task('mochaTest', () => {
  gulp.src(['test/**/*.js'])
    .pipe(mocha({ reporter: 'spec' }
    ));
});

gulp.task('sass', () => {
  gulp.src('public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
});

gulp.task('bower', () => {
  bower().pipe(gulp.dest('./bower_components'))
});

gulp.task('install', ['bower']);

gulp.task('test', ['mochaTest']);

gulp.task('default', ['lint', 'concurrent', 'sass']);
