'use strict';

var Fiber = require('fibers');
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var splitMediaQueries = require('gulp-split-media-queries');
var clip = require('gulp-clip-empty-files');
var eol = require('gulp-eol');

sass.compiler = require('sass');

gulp.task('sass', function () {
    return gulp.src('./var/view_preprocessed/pub/static/frontend/Magento/lsl/en_GB/sass/*.scss')
        .pipe(sass({fiber: Fiber}).on('error', sass.logError))
        .pipe(rename(function(path){
            path.dirname = path.dirname.replace('sass', 'css');
        }))
        .pipe(gulp.dest('./var/view_preprocessed/pub/static/frontend/Magento/lsl/en_GB/css/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./var/view_preprocessed/pub/static/frontend/Magento/lsl/en_GB/sass/*.scss', gulp.series('sass'));
});

gulp.task('split-css', function () {
    return gulp.src(['./var/view_preprocessed/pub/static/frontend/Magento/lsl/en_GB/css/*.css'])
        .pipe(splitMediaQueries({
            // If you change this number you will also need to change the media query in
            // app/code/local/JustKampers/Page/Block/Html/Head.php _prepareStaticAndSkinElements
            breakpoint: 520, // default is 768
        }))
        .pipe(rename(function(path){
            // splitMediaQueries likes to duplicate path a bit e.g. /v2/css/v2/css/styles-above-425.css
            // Remove the duplicate section of the path here.
            var split = path.dirname.split('/');
            for ( var i = 0; i < split.length - 1; i++ ) {
                var found = false;
                for ( var j = i + 1; j < split.length; j++ ) {
                    if ( split[i] == split[j] ) {
                        split[i] = '';
                        found = true;
                    }
                }
                if ( i == 0 && !found ) {
                    break;
                }
            }
            path.dirname = split.filter(function(e) { return e != '' }).join('/');
        }))
        // Remove empty files
        .pipe(clip())
        // Add new line to end of file.
        .pipe(eol())
        .pipe(gulp.dest('./var/view_preprocessed/pub/static/frontend/Magento/lsl/en_GB/css/'))
});

gulp.task('watch', function() {
    gulp.watch('./var/view_preprocessed/pub/static/frontend/Magento/lsl/en_GB/sass/*.scss', gulp.series('sass', 'split-css'));
});