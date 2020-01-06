var gulp = require('gulp');
// var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var minify = require('gulp-minify');

gulp.task('css', function() {
    return gulp.src(['public/*.css', 'public/**/*.css', '!public/dist/*.css', '!public/dist/**/*.css'])
        // .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/dist'))
});

gulp.task('js', function() {
    return gulp.src(['public/*.js', 'public/**/*.js', '!public/dist/*.js', '!public/dist/**/*.js'])
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('public/dist'));
});

gulp.task('default', ['js', 'css']);