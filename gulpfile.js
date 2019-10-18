const gulp = require('gulp');
const del = require('del');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const jsdoc = require('gulp-jsdoc3');
const header = require('gulp-header');
const footer = require('gulp-footer');

const fs = require('fs');

function clean() {
  return del(['dist', 'jsdocs', 'temp']);
}

function buildjs_init() {
  return gulp.src('src/**/[!_]*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest('temp'))
    .pipe(concat('jsmvc.js'))
    .pipe(gulp.dest('temp'));
}

function buildjs_finalize() {
  return gulp.src('temp/**/*.js')
    .pipe(header(fs.readFileSync('src/_header.js', 'utf8')))
    .pipe(footer(fs.readFileSync('src/_footer.js', 'utf8')))
    .pipe(gulp.dest('temp'));
}

function buildjs_jsdoc() {
  return gulp.src(['README.md', 'temp/**/jsmvc.js'], { read: false })
    .pipe(jsdoc({ opts: { destination: './jsdocs' } }));
}

function buildjs_complete() {
  return gulp.src('temp/**/*.js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('dist'));
}

const buildjs = gulp.series(buildjs_init, buildjs_finalize, gulp.parallel(buildjs_jsdoc, buildjs_complete));

module.exports.default = gulp.series(clean, buildjs);