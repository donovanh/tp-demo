var gulp = require("gulp"),
    browserSync = require("browser-sync"),
    changed = require("gulp-changed"),
    size = require("gulp-size"),
    sass = require("gulp-sass"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require('gulp-sourcemaps');

gulp.dest(function(file){
  return path.join(build_dir, path.dirname(file.path));
});

gulp.task("clean", function () {
  return gulp.src('./build', {read: false})
    .pipe(clean());
});

gulp.task("html", function() {
  return gulp.src(["./src/*.html", "./src/**/*.html"])
    .pipe(gulp.dest("build/"));
});

gulp.task("javascript", function() {
  return gulp.src(["./src/*.html", "./src/**/*.html"])
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
  return gulp.src(["./src/fonts/*"])
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

gulp.task("css", function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 2 versions', { cascade: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/stylesheets'))
    .pipe(size({title: 'styles'}))
});

gulp.task("headjs", function() {
  var scripts = [
    "./node_modules/i18next/dist/umd/i18next.js",
    "./node_modules/i18next-xhr-backend/dist/umd/i18nextXHRBackend.js",
    "./node_modules/jquery/dist/jquery.js",
    "./node_modules/jquery-i18next/dist/umd/jquery-i18next.js",
    "./src/vendor/mustache.js"
  ];
  return gulp.src(scripts)
    .pipe(concat('head.js'))
    .pipe(gulp.dest('build/javascripts'))
    .pipe(rename('head.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/javascripts'));
});

gulp.task("js", function() {
  var scripts = [
    "./src/javascripts/**/*.js"
  ];
  return gulp.src(scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/javascripts'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/javascripts'));
});

gulp.task("browser-sync", ["html","css","js"], function() {
  browserSync({
    server: {
      baseDir: "./build/",
      injectChanges: true,
      files: ["./build/**/*"],
    }
  });
});

gulp.task("watch", function() {
  // Watch .html files
  gulp.watch("src/*.html", ["html", browserSync.reload]);
  gulp.watch("src/**/*.html", ["html", browserSync.reload]);
  gulp.watch("src/**/*.scss", ["css", browserSync.reload]);
  gulp.watch("src/**/*.js", ["js", browserSync.reload]);
  gulp.watch("src/locales/**/*.json", ["locales", browserSync.reload]);
  gulp.watch("src/templates/**/*.mst", ["templates", browserSync.reload]);
  gulp.watch("src/**/*.jpg", ["images", browserSync.reload]);
  gulp.watch("src/**/*.png", ["images", browserSync.reload]);
  gulp.watch("src/**/*.svg", ["images", browserSync.reload]);
  gulp.watch("src/**/*.gif", ["images", browserSync.reload]);
  gulp.watch("src/**/*.zip", ["zips"]);
  gulp.watch("src/**/*.mp4", ["video"]);
  gulp.watch("src/**/*.webm", ["video"]);
});

gulp.task("default", ["html","headjs","js","css","templates","images","fonts","locales","browser-sync","zips","video","watch"]);
