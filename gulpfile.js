const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglifyjs");
const concat = require("gulp-concat");
const nodemon = require("gulp-nodemon");

function scss() {
  return gulp
    .src("dev/scss/**/*.scss")
    .pipe(sass())
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true,
      })
    )
    .pipe(cssnano())
    .pipe(gulp.dest("public/stylesheet"));
}

function scripts() {
  return (
    gulp
      .src([
        "dev/js/auth.js",
        "dev/js/post.js",
        "dev/js/comment.js",
        //   "node_modules/medium-editor/dist/js/medium-editor.js",
        //
      ])
      .pipe(concat("scripts.js")) // объединяет
      //.pipe(uglify()) // сжимает
      .pipe(gulp.dest("public/javascripts"))
  );
}

function go() {
  nodemon({
    script: "app.js",
    watch: ["app.js", "gulpfile.js", "public/*", "public/*/**"],
    ext: "js",
  }).on("restart", () => {
    gulp.src("app.js");
  });
  gulp.watch("dev/scss/**/*.scss", scss);
  gulp.watch("dev/js/**/*.js", scripts);
}

module.exports.default = gulp.series(go, scripts, scss);

// gulp.task("default", gulp.series("scss", "scripts"), () => {
//   gulp.watch("dev/scss/**/*.scss", gulp.start("scss"));
//   gulp.watch("dev/js/**/*.js", gulp.start("scripts"));
// });
