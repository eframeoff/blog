const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglifyjs");
const concat = require("gulp-concat");
const nodemon = require("gulp-nodemon");

var paths = {
  scss: {
    src: "dev/scss/**/*.scss",
    dest: "public/stylesheet",
  },
  scripts: {
    src: "dev/js/*.js",
    dest: "public/javascripts",
  },
};

gulp.task("scss", function () {
  var tsc = gulp
    .src(paths.scss.src)
    .pipe(sass())
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true,
      })
    )
    .pipe(cssnano())
    .pipe(gulp.dest(paths.scss.dest));

  return tsc;
});

gulp.task("scripts", function () {
  var tsc = gulp
    .src(paths.scripts.src)
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));

  return tsc;
});

gulp.task("go", function () {
  nodemon({
    script: "app.js",
    watch: ["app.js", "gulpfile.js", "public/*", "public/*/**"],
    ext: "js",
  }).on("restart", () => {
    gulp.src("app.js");
  });
});

gulp.task("watch", function () {
  gulp.watch("dev/scss/**/*.scss", gulp.series("scss"));
  gulp.watch("dev/js/**/*.js", gulp.series("scripts"));
});

gulp.task("default", gulp.parallel("go", "scss", "scripts", "watch"));
