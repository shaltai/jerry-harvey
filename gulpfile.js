import gulp from 'gulp';
import browserSync from 'browser-sync';
import fileInclude from 'gulp-file-include';
import rename from 'gulp-rename';
import del from 'del';
import postCSS from 'gulp-postcss';
import autoPrefixer from 'autoprefixer';
import cssnano from 'cssnano';
import scss from 'gulp-sass';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import imageMin from 'gulp-imagemin';
import webP from 'imagemin-webp';
import webPhtml from 'gulp-webp-html';
import replace from 'gulp-replace';
import svgSprite from 'gulp-svg-sprite';
// import fs from 'fs';


// Paths

const projectFolder = 'public';
const sourceFolder = 'src';
const path = {
	build: {
		html: projectFolder + '/',
		styles: projectFolder + '/styles/',
		scripts: projectFolder + '/scripts/',
		images: projectFolder + '/img/',
		fonts: projectFolder + '/fonts/',
	},
	src: {
		html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
		styles: sourceFolder + '/styles/styles.scss',
		scripts: sourceFolder + '/scripts/scripts.js',
		images: sourceFolder + '/img/**/*.{jpg,jpef,png,svg,gif,ico,webp}',
		fonts: sourceFolder + '/fonts/*.{ttf,otf}',
	},
	watch: {
		html: sourceFolder + '/**/*.html',
		styles: sourceFolder + '/styles/**/*.scss',
		scripts: sourceFolder + '/scripts/**/*.js',
		images: sourceFolder + '/img/**/*.{jpg,jpef,png,svg,gif,ico,webp}',
	},
	clean: [projectFolder + '/**', '!' + projectFolder + '/fonts'],
};

// HTML

export const html = () => {
	return gulp.src(path.src.html)
		.pipe(fileInclude())
		.pipe(webPhtml())
		.pipe(replace('.webp', '.min.webp'))
		.pipe(replace('.jpg', '.min.jpg'))
		.pipe(replace('.png', '.min.png'))
		.pipe(replace('.gif', '.min.gif'))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
};

// Styles

export const styles = () => {
	return gulp.src(path.src.styles)
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(postCSS([
			autoPrefixer,
			cssnano,
		]))
		.pipe(gulp.dest(path.build.styles))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(path.build.styles))
		.pipe(browserSync.stream());
};

// Scripts

export const scripts = () => {
	return gulp.src(path.src.scripts)
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(fileInclude())
		.pipe(gulp.dest(path.build.scripts))
		.pipe(terser())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(path.build.scripts))
		.pipe(browserSync.stream());
};

// Images

export const images = () => {
	return gulp.src(path.src.images)
		.pipe(imageMin([
			imageMin.mozjpeg({ quality: 75, progressive: true }),
		]))
		.pipe(rename(function (path) {
			path.basename += '.min';
		}))
		.pipe(gulp.dest(path.build.images))
		.pipe(imageMin([
			webP({
				quality: 75
			})
		]))
		.pipe(rename({
			extname: '.webp'
		}))
		.pipe(gulp.dest(path.build.images))
		.pipe(browserSync.stream());
};

// Clean 

export const clean = () => {
	return del(path.clean);
}

// Server

export const server = () => {
	browserSync.init({
		server: {
			baseDir: projectFolder,
		},
		notify: false,
	});
};

// Watch

export const watch = () => {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.styles, styles);
	gulp.watch(path.watch.scripts, scripts);
	gulp.watch(path.watch.images, images);
}

// Sprites

export const sprites = () => {
	return gulp.src(sourceFolder + '/icons/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../icons/icons.svg',
					example: true
				}
			}
		}))
		.pipe(gulp.dest(path.build.images))
}

// Default

export default gulp.series(
	clean,
	gulp.parallel(
		html,
		styles,
		scripts,
		images,
	),
	gulp.parallel(
		server,
		watch,
	)
);
