'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	browserSync = require("browser-sync").create(),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	del = require('del'),
	gcmq = require('gulp-group-css-media-queries');

var svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');

var sassOpts = {
	outputStyle: "expanded", //nested:compact:expanded:compressed
	precision: 3,
	errLogToConsole: true,
	//errLogToConsole: false,
	onError: function(err) {
		return notify().write(err);
	}
};

gulp.task('svgSpriteBuild', function () {
	return gulp.src('app/svg/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill and style declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		// cheerio plugin create unnecessary string '>', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: "symbols",
			preview: false,
			selector: "icon-%f",
			svg: {
				symbols: 'symbol_sprite.html'
			}
		}))
		.pipe(gulp.dest('htdocs/public/icons/'));
});


gulp.task('clean', function () {
	return del('htdocs/public');
});

gulp.task('styles', function () {
	return gulp.src('app/styles/style.scss')
		.pipe(sourcemaps.init())
		//.pipe(sass(sassOpts).on('error', sass.logError))
		.pipe(sass(sassOpts))
			   // todo при добавления плагина для группировки медиазапросов, рушаться sourcmap
	    // .pipe(gcmq())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest('htdocs/public/css'));
});

gulp.task('pages', function buildHTML() {
	return gulp.src('app/pages/*.pug', {
		//since: gulp.lastRun('pages')
	})
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('htdocs/public'))
});

gulp.task('assets', function () {
	return gulp.src('app/assets/**', {
		since: gulp.lastRun('assets')
	})
		.pipe(gulp.dest('htdocs/public'))
});

gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: "htdocs/public/"
		},
		port: 8080,
		open: true,
		notify: false
	});
	browserSync.watch('htdocs/public/**/*.*').on('change', browserSync.reload);
});

gulp.task('watch', function () {
	gulp.watch('app/styles/**/*.scss', gulp.series('styles'));
	gulp.watch('app/pages/**/*.pug', gulp.series('pages'));
	gulp.watch('app/assets/**/*.*', gulp.series('assets'));
	gulp.watch('app/svg/**/*.svg', gulp.series('svgSpriteBuild'));
});

gulp.task('build', gulp.parallel('pages', 'assets', 'svgSpriteBuild', 'styles'));

gulp.task('dev',
	gulp.series('clean', 'build', gulp.parallel('watch', 'serve'))
);