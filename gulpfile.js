// Uses Gulp version 4
const { src, dest, watch, series, parallel } = require('gulp'),
      replace = require('gulp-replace'), // Regex to cache bust CSS/JS (i.e. versioning)
      browser_sync = require('browser-sync').create() // Web Server

const sass = require('gulp-sass'), // Compiles SCSS to CSS
      postcss = require('gulp-postcss'), // Runs CSS functions (autoprefixer and cssnano)
      autoprefixer = require('autoprefixer'), // Adds vendor prefixes to CSS
      postcss_clean = require('postcss-clean'), // Minifies CSS
      sourcemaps = require('gulp-sourcemaps') // Creates source maps (map CSS to SASS)

const uglify = require('gulp-uglify'), // Minifies JS
      concat = require('gulp-concat') // Concatenates multiple files into one (JS)
      babel  = require('gulp-babel') // Convert ES6+ JS to ES2015

const handlebars = require('gulp-hb') // Compiles HBS Template Files

const image_resize = require('gulp-image-resize') // Optimize Images, requires: `sudo apt-get install graphicsmagick`

const path = {
  root: 'dist/',
  input: {
    html: 'src/views/**/!(_)*.html',
    sass: 'src/sass/**/*.scss',
    js: 'src/js/*.js',
    images: 'src/images/**/*.{jpg,jpeg,png,gif,svg}',
    hbs_helpers: 'src/lib/helpers/*.js',
  },
  output: {
    html: 'dist/',
    css: 'dist/css',
    js: 'dist/js',
    images: 'dist/images',
  },
  partials: {
    atoms: 'src/views/atoms/**/*.hbs',
    molecules: 'src/views/molecules/**/*.hbs',
    layouts: 'src/views/layouts/**/*.hbs',
    ctas: 'src/views/molecules/cta/**/*.hbs',
  },
}

function html_task () {
  let version = new Date().getTime()
  return src(path.input.html)
    .pipe(handlebars()
      .partials(path.partials.atoms)
      .partials(path.partials.molecules)
      .partials(path.partials.layouts)
      .partials(path.partials.ctas)
      // .helpers(path.input.hbs_helpers)
      // .data('src/assets/data/**/*.{js,json}')
    )
    .pipe(replace(/version=\d*/g, `version=${version}`))
    .pipe(dest(path.output.html))
    .pipe(browser_sync.stream())
}

function sass_task () {
  return src(path.input.sass)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer(), postcss_clean() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.output.css))
    .pipe(browser_sync.stream())
}

function js_task () {
  return src([path.input.js])
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest(path.output.js))
    .pipe(browser_sync.stream())
}

function images_task () {
  return src([path.input.images])
    .pipe(
      image_resize({
        width: 1920,
        cover: true, // Maintain aspect ratio
        upscale: false, // Don't resize up if smaller than 1920px
        quality: 0.50,
        flatten: true, // Create one layer for multi-layer PNGs
      }))
    .pipe(dest(path.output.images))
    .pipe(browser_sync.stream())
}

function watch_task () {
  browser_sync.init({
    server: {
      baseDir: path.root,
      // proxy: "localsite.dev"
    }
  })
  watch (
    [
      path.input.html, 
      path.input.sass, 
      path.input.js,
      path.input.images,
      path.partials.atoms,
      path.partials.molecules,
      path.partials.layouts,
      path.partials.ctas,
    ],
    parallel(
      html_task, 
      sass_task, 
      js_task,
      images_task,
    ),
  )
}

exports.default = series(
  parallel(html_task, sass_task, js_task, images_task),
  watch_task,
)
