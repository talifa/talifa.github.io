module.exports = function() {
  $.gulp.task("libsJS:dev", () => {
    return $.gulp
      .src([
        "node_modules/svg4everybody/dist/svg4everybody.min.js",
        "node_modules/air-datepicker/dist/js/datepicker.min.js",
        "node_modules/vue/dist/vue.min.js"
      ])
      .pipe($.gp.concat("libs.min.js"))
      .pipe($.gulp.dest("./build/static/js/"))
      .pipe(
        $.browserSync.reload({
          stream: true
        })
      );
  });

  $.gulp.task("libsJS:build", () => {
    return $.gulp
      .src([
        "node_modules/svg4everybody/dist/svg4everybody.min.js",
        "node_modules/air-datepicker/dist/js/datepicker.min.js",
        "node_modules/vue/dist/vue.min.js"
      ])
      .pipe($.gp.concat("libs.min.js"))
      .pipe($.gp.uglifyjs())
      .pipe($.gulp.dest("./build/static/js/"));
  });

  $.gulp.task("js:copy", () => {
    return $.gulp
      .src(["./dev/static/js/*.js", "!./dev/static/js/libs.min.js"])
      .pipe($.gulp.dest("./build/static/js/"))
      .pipe(
        $.browserSync.reload({
          stream: true
        })
      );
  });
};
