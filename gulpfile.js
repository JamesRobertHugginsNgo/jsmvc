const gulp = require('gulp');
const del = require('del');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const jsdoc = require('gulp-jsdoc3');

function clean() {
  return del('dist');
}

function build1() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('dist'));
}

function build2() {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(concat('jsmvc.js'))
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('dist'));
}

const build = gulp.parallel(build1, build2);

module.exports.default = gulp.series(clean, build);

function makeDoc() {
  return gulp.src(['README.md', 'src/**/*.js'])
    .pipe(jsdoc());
}

module.exports.makeDoc = makeDoc;