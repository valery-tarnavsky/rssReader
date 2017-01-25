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
		return gulp.src('public/scss/**/*.scss')
			.pipe(sass())
			.pipe(autoprefixer({
				cascade: true
			}))
			.pipe(gulp.dest('public/dist/css'))
			.pipe(sourcemaps.init())
			.pipe(cssmin())
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('public/css'));
	});

	gulp.task('watch', function() {
    	gulp.watch('public/scss/**/*.scss', ['sass']);
    });
	gulp.task('default', ['sass','watch']);

	/*gulp.task('index', function () {
		var target = gulp.src('index.html');
		var sources = gulp.src(['./js/!**!/!*.js', './css/!**!/!*.css'], {read: false});
		return target.pipe(inject(sources))
			.pipe(gulp.dest('./index.html'));
	});
*/