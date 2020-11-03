'use strict';

const gulp = require('gulp');
const minify = require('gulp-minify');
const babel = require('gulp-babel');
const argv = require('yargs').argv;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const concatCss = require('gulp-concat-css');
const config = JSON.parse(fs.readFileSync(`./${argv.path}/config.json`, 'utf8'));
const apiKey = config.API;
const apiKey_dev = config.API_dev ? config.API_dev : config.API;
// const apiKey = '157130078552210927';
sass.compiler = require('node-sass');


function styles() {
  return (
    gulp
      .src([`./${argv.path}/src/sass/*.sass`, `./${argv.path}/src/*.css`])
      .pipe(plumber())
      // .pipe(sourcemaps.init())
      // .pipe(sass().on('error', sass.logError))
      .pipe(sass().on('error', notify.onError()))
      .pipe(autoprefixer())
      // .pipe(sourcemaps.write())
      .pipe(concatCss(`styles.css`))
      .pipe(gulp.dest(`./${argv.path}/build`))
      .pipe(browserSync.stream())
  );
}

function scripts() {
  return gulp.src(`./${argv.path}/src/calculator.js`)
  // .pipe(sourcemaps.init())
  .pipe(babel({
    presets: [['@babel/env', { "modules": false }]]
  }))
  .pipe(minify({
    ext:{
      src: '-' + apiKey_dev + '-dev.js',
      min: '-' + apiKey + '.js',
      min: `-${apiKey}.js`
    }
  }))
  // .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`./${argv.path}/build`))
  .pipe(browserSync.stream());
};

function clean() {
  return del([`./${argv.path}/build/*`]);
};

function watch() {
  browserSync.init({
    server: {
        baseDir: `./${argv.path}/`
    }
  });

  gulp.watch(`./${argv.path}/src/sass/styles.sass`, styles);
  gulp.watch(`./${argv.path}/src/**/*.*`, styles);
  gulp.watch(`./${argv.path}/src/calculator.js`, scripts);
  gulp.watch(`./${argv.path}/*.html`).on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('clean', clean);
gulp.task('watch', watch);

//-- Gulp Tasks --//
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('default', gulp.series('build', 'watch'));