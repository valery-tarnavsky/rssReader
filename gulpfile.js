var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	cssmin = require("gulp-cssmin"),
	rename = require("gulp-rename"),
	sourcemaps = require('gulp-sourcemaps');
   /* inject = require('gulp-inject')*/

	gulp.task('sass', function () {
		return gulp.src('./scss/**/*.scss')
			.pipe(sass())
			.pipe(autoprefixer({
				cascade: true
			}))
			.pipe(gulp.dest('dist/css'))
			.pipe(sourcemaps.init())
			.pipe(cssmin())
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./css'));
	});

	gulp.task('watch', function() {
    	gulp.watch('./scss/**/*.scss', ['sass']);
    });
	gulp.task('default', ['sass','watch']);

	/*gulp.task('index', function () {
		var target = gulp.src('index.html');
		var sources = gulp.src(['./js/!**!/!*.js', './css/!**!/!*.css'], {read: false});
		return target.pipe(inject(sources))
			.pipe(gulp.dest('./index.html'));
	});
*/