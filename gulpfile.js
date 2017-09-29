var gulp = require("gulp"),
    browserSync = require("browser-sync"),
    changed = require("gulp-changed"),
    size = require("gulp-size"),
    sass = require("gulp-sass"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    path = require('path'),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    addsrc = require('gulp-add-src'),
    zip = require('gulp-zip'),
    forEach = require('gulp-foreach'),
    flatten = require('gulp-flatten'),
    inlinesource = require('gulp-inline-source'),
    fileinclude = require('gulp-file-include');

gulp.dest(function(file){
  return path.join(build_dir, path.dirname(file.path));
});

gulp.task("clean", function () {
  gulp.src('./build', {read: false})
    .pipe(clean());
  gulp.src('./output', {read: false})
    .pipe(clean());
  gulp.src('./zips', {read: false})
    .pipe(clean());
});

gulp.task("clean:output", function () {
  return gulp.src('./output', {read: false})
    .pipe(clean());
});

gulp.task("clean:zips", function () {
  return gulp.src('./zips', {read: false})
    .pipe(clean());
});

gulp.task("html", function() {
  return gulp.src(["./src/pages/*.html"])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './src'
    }))
    .pipe(inlinesource())
    .pipe(gulp.dest("build/"));
});

gulp.task("images", function() {
  return gulp.src(["./src/**/*.jpg", "./src/**/*.png", "./src/**/*.gif", "./src/**/*.svg"])
    .pipe(gulp.dest("build/"));
});

gulp.task("zips", function() {
  return gulp.src(["./src/**/*.zip"])
    .pipe(gulp.dest("build/"));
});

gulp.task("fonts", function() {
  return gulp.src(["./src/fonts/**"])
    .pipe(gulp.dest("build/fonts/"));
});

gulp.task("video", function() {
  return gulp.src(["./src/**/*.mp4", "./src/**/*.webm"])
    .pipe(gulp.dest("build/"));
});

gulp.task("locales", function() {
  return gulp.src(["./src/locales/*.json"])
    .pipe(gulp.dest("build/locales/"));
});

gulp.task("templates", function() {
  return gulp.src(["./src/templates/**/*.mst"])
    .pipe(gulp.dest("build/templates/"));
});

gulp.task("data", function() {
  return gulp.src(["./src/data/**"])
    .pipe(gulp.dest("build/data/"));
});

gulp.task("css", function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 2 versions', { cascade: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/stylesheets'))
    .pipe(size({title: 'styles'}))
});

gulp.task("browser-sync", ["html","css"], function() {
  browserSync({
    server: {
      baseDir: "./build/",
      injectChanges: true,
      files: ["./build/**/*"],
    }
  });
});

gulp.task('make', function() {
  return gulp.src('build/*.html')
    .pipe(rename(function(file) {
      file.dirname = path.join(file.dirname, file.basename);
      file.basename = 'index';
      file.extname = '.html';
    }))
    .pipe(gulp.dest('output/'))
    .pipe(
      forEach( (stream, file) => {
      let fileName = file.relative.replace('/index.html', '');
      addAssets(fileName);
      return stream
    }));
});

function addAssets(fileName) {
  // gulp.src('build/javascripts/**')
  //   .pipe(gulp.dest('output/' + fileName + '/javascripts'));     
  gulp.src('build/locales/**')
    .pipe(gulp.dest('output/' + fileName + '/locales'));   
  gulp.src('build/fonts/**')
    .pipe(gulp.dest('output/' + fileName + '/fonts'));  
  gulp.src('build/images/**')
    .pipe(gulp.dest('output/' + fileName + '/images'));
  gulp.src('build/stylesheets/**')
    .pipe(gulp.dest('output/' + fileName + '/stylesheets')); 
  // gulp.src('build/templates/**')
  //   .pipe(gulp.dest('output/' + fileName + '/templates')); 
}

function zipFolder(name) {
  console.log('Zipping ', name);
  gulp.src('output/' + name + '/**')
    .pipe(zip(name + '.zip'))
    .pipe(gulp.dest('zips'));
}

gulp.task('zip', ['clean:zips'], function() {
  return gulp.src('output/**/*.html')
    .pipe(forEach( (stream, file) => {
      let fileName = file.relative.replace('/index.html', '');
      zipFolder(fileName);
      return stream;
    }))
});


gulp.task("build", ["html","css","templates","images","fonts","locales","zips","video","data","make"])
gulp.task("watch", function() {
  // Watch .html files
  gulp.watch("src/*.html", ["html", browserSync.reload]);
  gulp.watch("src/**/*.html", ["html", browserSync.reload]);
  gulp.watch("src/**/*.scss", ["css", browserSync.reload]);
  gulp.watch("src/**/*.js", ["html", browserSync.reload]);
  gulp.watch("src/locales/**/*.json", ["locales", browserSync.reload]);
  gulp.watch("src/templates/**/*.mst", ["templates", browserSync.reload]);
  gulp.watch("src/data/**", ["data", browserSync.reload]);
  gulp.watch("src/**/*.jpg", ["images", browserSync.reload]);
  gulp.watch("src/**/*.png", ["images", browserSync.reload]);
  gulp.watch("src/**/*.svg", ["images", browserSync.reload]);
  gulp.watch("src/**/*.gif", ["images", browserSync.reload]);
  gulp.watch("src/**/*.zip", ["zips"]);
  gulp.watch("src/**/*.mp4", ["video"]);
  gulp.watch("src/**/*.webm", ["video"]);
});

gulp.task("default", ["build","browser-sync","watch"]);
