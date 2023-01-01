const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const prefix = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();

var displayError = function (error) {
  // Initial building up of the error
  var errorString = "[" + error.plugin.error.bold + "]";
  errorString += " " + error.message.replace("\n", ""); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if (error.fileName) errorString += " in " + error.fileName;

  if (error.lineNumber) errorString += " on line " + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
};

var onError = function (err) {
  notify.onError({
    title: "Gulp",
    subtitle: "Failure!",
    message: "Error: <%= error.message %>",
    sound: "Basso",
  })(err);
  this.emit("end");
};

var sassOptions = {
  outputStyle: "expanded",
};

function styles() {
  return gulp
    .src("./app/scss/main.scss")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix())
    .pipe(rename("main.css"))
    .pipe(gulp.dest("./app/assets/css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./app/assets/css"));
}

function watch() {
  styles();
  browserSync.init({
    server: "./app",
  });

  gulp.watch("./app/scss/**/*.scss", styles);
  gulp.watch("./app/scss/**/*.scss").on("change", browserSync.reload);
  gulp.watch("./app/*.html").on("change", browserSync.reload);
}

module.exports = {
  styles,
  watch,
};
