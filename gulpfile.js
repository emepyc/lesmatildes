var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var closureCompiler = require('gulp-closure-compiler');
var webserver = require('gulp-webserver');

var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var csspurge = require('gulp-css-purge');
var minifyCss = require('gulp-minify-css');

var gzip = require('gulp-gzip');
var del = require("del");
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');


var buildDir = "app/build";
var componentsConfig = "components.js";
var packageConfig = require("./package.json");

var webappName = packageConfig.name;


// path tools
var path = require('path');
var join = path.join;
var mkdirp = require('mkdirp');


// Output Files and Paths
var webappFile = webappName + ".js";
var webappFileFull = join (buildDir, webappFile);
var webappFileMin = webappName + ".min.js";
var webappFileMinFull = join (buildDir, webappFileMin);
var webappFileGz = webappFileMin + "gz";

// 3rd party
var webapp3rdparty = webappName + "-3rdParty.js";
var webapp3rdpartyFull = join (buildDir, webapp3rdparty);
var webapp3rdpartyMin = webapp3rdparty + ".min.js";
var webapp3rdpartyMinFull = join (buildDir, webapp3rdpartyMin);
var webapp3rdpartyCss = webappName + "-3rdParty.css";


var webappFiles = require ("./webappFiles.js");


gulp.task('lint', function() {
    return gulp.src('app/js/**/*.js')
	.pipe(ignore.exclude(/bower_components/))
	.pipe(ignore.exclude(/node_modules/))
	.pipe(ignore.exclude(/test/))
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

// will remove everything in build
gulp.task('clean', function () {
    return del ([buildDir]);
});

// just makes sure that the build dir exists
gulp.task('init', function() {
    mkdirp(buildDir, function (err) {
        if (err) {
            console.error(err);
        }
    });
});


gulp.task('copy-fontawesome', function () {
    var fontawesomePath = buildDir + '/fontawesome/';
    mkdirp(fontawesomePath, function (err) {
        if (err) {
            console.error(err);
        }
    });
    return gulp.src('bower_components/components-font-awesome/**/*')
        .pipe(gulp.dest(fontawesomePath));
});

gulp.task('copy-foundation', function () {
    var foundationPath = buildDir + '/foundation/';
    mkdirp (foundationPath, function (err) {
        if (err) {
            console.error(err);
        }
    });
    return gulp.src('bower_components/foundation/**/*')
        .pipe(gulp.dest(foundationPath));
});

gulp.task('copy-slick', function () {
    var slickPath = buildDir + '/slick/';
    mkdirp (slickPath, function (err) {
        if (err) {
            console.log(err);
        }
    });
    return gulp.src('bower_components/slick-carousel/slick/**/*')
        .pipe(gulp.dest(slickPath));
});


// gulp.task('build-3rdparty-styles', ['copy-foundation', 'copy-fontawesome', 'copy-slick'], function () {
//     return gulp.src(webappFiles.thirdParty.css)
//         .pipe(concat(webapp3rdpartyCss))
//         .pipe(gulp.dest(buildDir));
// });
//


// gulp.task('build-3rdparty', ['build-3rdparty-styles'], function () {
gulp.task('build-3rdparty', function () {
    return gulp.src(webappFiles.thirdParty.js)
        .pipe(concat(webapp3rdparty))
        .pipe(gulp.dest(buildDir));
});



gulp.task('build-webapp-styles', ['copy-foundation', 'copy-fontawesome', 'copy-slick'], function () {
    return gulp.src(webappFiles.cttv.css)
        .pipe(sass({
            errLogToConsole: true
        }))
        // .pipe(csspurge())
        .pipe(sourcemaps.init())
        .pipe(concat(webappName + ".min.css"))
        .pipe(minifyCss({compatibility: 'ie9'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildDir));
});


gulp.task('build-webapp', ['build-webapp-styles'], function () {
    return gulp.src(webappFiles.cttv.js)
        .pipe(sourcemaps.init({
            debug: true
        }))
        .pipe(concat(webappFileMin))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build-all', ['init', 'build-3rdparty', 'build-webapp']);

gulp.task('serve', function() {
    gulp.src('app')
        .pipe(webserver({
            livereload:true,
            directoryListing:true,
            open:true,
            // path: 'app',
            // fallback: 'index.html'
        }));
});
