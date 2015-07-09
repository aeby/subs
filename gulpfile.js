var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', function () {
    gulp.src('src/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist'));
    gulp.src('src/*.svg')
        .pipe(plugins.svgmin())
        .pipe(gulp.dest('dist'));
    gulp.src('src/*.css')
        .pipe(plugins.cssmin())
        .pipe(gulp.dest('dist'));
    gulp.src('src/*.html')
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});
