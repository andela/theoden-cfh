/* eslint-disable */
const bower = require('gulp-bower');
const browserSync = require('browser-sync');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
/* eslint-enable */

gulp.task('watch', () => {
  gulp.watch('app/views/**', browserSync.reload());
  gulp.watch('public/js/**', browserSync.reload());
  gulp.watch('app/**/*.js', browserSync.reload());
  gulp.watch('public/views/**', browserSync.reload());
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/views/articles.scss', ['sass']);
  gulp.watch('public/css/**', browserSync.reload());
});

gulp.task('bower', () => bower().pipe(gulp.dest('./public/lib')));

gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['app', 'config'],
    env: {
      PORT: 3000,
    }
  });
});

gulp.task('lint', () => {
  gulp.src(['public/js/**/*.js',
    'app/**/*.js',
    'test/**/*.js'])
    .pipe(eslint());
});

gulp.task('sass', () => {
  gulp.src('public/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

gulp.task('mochaTest', () => {
  gulp.src(['test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
    }));
});

// Concurrent Tasks
gulp.task('concurrent', ['watch', 'nodemon']);

/** Installation Sequence */
gulp.task('install', ['clean']);

// Delete bower_components folder
gulp.task('clean', ['move:route'], () =>
  gulp.src('bower_components', { read: false })
    .pipe(clean())
);
// Move route.js in angular-ui-utils
gulp.task('move:route', ['move:bootstrap'], () => {
  gulp.src('public/lib/angular-ui-utils/modules/route/**/*.*')
    .pipe(gulp.dest('public/lib/angular-ui-utils/modules/'));
});

// Move bootstrap files
gulp.task('move:bootstrap', ['runbower'], () => {
  gulp.src('public/lib/bootstrap/dist/**/*.*')
    .pipe(gulp.dest('public/lib/bootstrap/'));
});

// Bower task
gulp.task('runbower', ['bower']);

// Test
gulp.task('test', ['mochaTest']);

// Default task(s)
gulp.task('default', ['lint', 'concurrent', 'sass']);
