const {
  src, dest, series, watch,
} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixes = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const purify = require('gulp-purifycss');
const rename = require('gulp-rename');

const cleanAll = () => del(['dev', 'dist']);
exports.clean = cleanAll;

const clean = () => del(['dev']);

const resources = () => src('src/res/**').pipe(dest('dev/res'));

const html = () => src('src/**/*.html').pipe(dest('dev'));

const htmlReset = (done) => {
  browserSync.reload();
  done();
};
const scripts = () => src(['src/js/main.js', 'src/js/**/_*.js'], { allowEmpty: true })
  .pipe(concat('main.js'))
  .pipe(dest('dev/js'))
  .pipe(browserSync.stream());

const scriptsModulesMove = () => src(['src/js/m_*.js'])
  .pipe(rename((path) => {
    path.basename = path.basename.substring(2);
  }))
  .pipe(dest('dev/js'))
  .pipe(browserSync.stream());

const svgSprites = () => src('src/img/svg/**/*.svg')
  .pipe(
    svgSprite({
      mode: {
        view: {
          bust: false,
          sprite: '../img/svg/sprite.svg',
        },
      },
    }),
  )
  .pipe(dest('dev'));

const images = () => src(['src/img/**/*.jpg', 'src/img/**/*.png', 'src/img/**/*.jpeg'])
  .pipe(image())
  .pipe(dest('dev/img'));

const CSS = () => src(['./src/css/styles.css'])
  .pipe(
    autoprefixes({
      cascade: false,
    }),
  )
  .pipe(
    cleanCSS({
      level: {
        2: {
          removeDuplicateRules: true,
        },
      },
      format: 'beautify',
    }),
  )
  .pipe(dest('dev/css'));

const removeSelectors = () => src('./dev/css/**/*.css')
  .pipe(
    purify(['./dev/js/**/*.js', './dev/**/*.html'], {
      rejected: true,
    }),
  )
  .pipe(dest('./dev/css'));

const CSSconcat = () => src([
  './src/css/normalize.css',
  './src/css/[!styles][!media]*.css',
  './dev/css/styles.css',
  './src/css/media.css',
], { allowEmpty: true })
  .pipe(sourcemaps.init())
  .pipe(concat('styles.css'))
  .pipe(sourcemaps.write())
  .pipe(dest('dev/css'))
  .pipe(browserSync.stream());

const watchFiles = () => {
  browserSync.init({
    open: false,
    server: {
      baseDir: 'dev',
    },
  });
};

watch('src/*.html', series(html, CSS, removeSelectors, CSSconcat, htmlReset));
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', series(scripts, scriptsModulesMove));
watch('src/res/**', resources);
watch('src/css/**/*.css', series(CSS, removeSelectors, CSSconcat));

exports.default = series(
  clean,
  resources,
  html,
  scripts,
  scriptsModulesMove,
  svgSprites,
  images,
  CSS,
  removeSelectors,
  CSSconcat,
  watchFiles,
);

const cleanDist = () => del(['dist']);

const resourcesDist = () => src('src/res/**').pipe(dest('dist/res'));

const htmlMinify = () => src('src/**/*.html')
  .pipe(
    htmlMin({
      collapseWhitespace: true,
    }),
  )
  .pipe(dest('dist'));

const scriptsDist = () => src(['src/js/main.js', 'src/js/**/_*.js'], { allowEmpty: true })
  .pipe(
    babel({
      presets: ['@babel/env'],
    }),
  )
  .pipe(concat('main.js'))
  .pipe(
    uglify({
      toplevel: true,
    }).on('error', notify.onError()),
  )
  .pipe(dest('dist/js'));

const scriptsModulesMoveDist = () => src(['src/js/m_*.js'])
  .pipe(rename((path) => {
    path.basename = path.basename.substring(2);
  }))
  .pipe(dest('dist/js'));

const svgSpritesDist = () => src('src/img/svg/**/*.svg')
  .pipe(
    svgSprite({
      mode: {
        view: {
          bust: false,
          sprite: '../img/svg/sprite.svg',
        },
      },
    }),
  )
  .pipe(dest('dist'));

const imagesDist = () => src(['src/img/**/*.jpg', 'src/img/**/*.png', 'src/img/**/*.jpeg'])
  .pipe(image())
  .pipe(dest('dist/img'));

const CSSDist = () => src([
  './src/css/normalize.css',
  './src/css/[!styles]*.css',
  './src/css/styles.css',
])
  .pipe(concat('styles.css'))
  .pipe(
    autoprefixes({
      cascade: false,
    }),
  )
  .pipe(
    cleanCSS({
      level: 2,
    }),
  )
  .pipe(dest('dist/css'));

exports.dist = series(
  cleanDist,
  resourcesDist,
  htmlMinify,
  scriptsDist,
  scriptsModulesMoveDist,
  svgSpritesDist,
  imagesDist,
  CSSDist,
);
