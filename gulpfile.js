const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const purgecss = require('gulp-purgecss');
const webp = require('gulp-webp');
const ttf2woff2 = require('gulp-ttf2woff2');
const webpack = require('webpack-stream');
const cssnano = require('gulp-cssnano');

//
const webpackCfg = require('./webpack.config');

gulp.task('server', function () {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('styles', function () {
  return gulp
    .src('src/styles/styles.+(scss|sass)')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(
      purgecss({
        content: ['src/**/*.html']
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch('src/styles/**/*.+(scss|sass|css)', gulp.parallel('styles'));
  gulp.watch('src/*.html').on('change', gulp.parallel('html'));
  gulp.watch('src/js/**/*.js').on('change', gulp.parallel('scripts'));
  gulp.watch('src/fonts/**/*').on('all', gulp.parallel('fonts'));
  gulp.watch('src/icons/**/*').on('all', gulp.parallel('icons'));
  gulp.watch('src/img/**/*').on('all', gulp.parallel('images'));
  gulp.watch('src/fonts/').on('all', gulp.parallel('fonts'));
});

gulp.task('html', function () {
  return gulp
    .src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function () {
  return gulp
    .src('src/js/**/*.js')
    .pipe(webpack(webpackCfg))
    .pipe(gulp.dest('dist/js', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function () {
  return gulp
    .src('src/fonts/**/*')
    .pipe(ttf2woff2())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('icons', function () {
  return gulp
    .src('src/icons/**/*')
    .pipe(gulp.dest('dist/icons'))
    .pipe(browserSync.stream());
});

gulp.task('images', function () {
  return gulp
    .src('src/img/**/*')
    .pipe(imagemin())
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task(
  'default',
  gulp.parallel(
    'watch',
    'server',
    'styles',
    'scripts',
    'fonts',
    'icons',
    'html',
    'images'
  )
);
