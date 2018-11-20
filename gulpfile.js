var concat        = require('gulp-concat');
var cssnano       = require('gulp-cssnano');
var del           = require('del');
var expires       = new Date().setUTCFullYear(new Date().getFullYear() + 5);
var gulp          = require('gulp');
var rename        = require('gulp-rename');
var header        = require('gulp-header');
var imagemin      = require('gulp-imagemin');
var jshint        = require('gulp-jshint');
var jshintstylish = require('jshint-stylish');
var livereload    = require('gulp-livereload');
var map           = require('map-stream');
var modernizr     = require('gulp-modernizr');
var notify        = require('gulp-notify');
var pkg           = require('./package.json');
var plumber       = require('gulp-plumber');
var pngquant      = require('imagemin-pngquant');
var prefix        = require('gulp-autoprefixer');
var replace       = require('gulp-replace');
var runsequence   = require('run-sequence');
var sass          = require('gulp-ruby-sass');
var shell         = require('gulp-shell');
var sourcemaps    = require('gulp-sourcemaps');
var svgsymbols    = require('gulp-svg-symbols');
var uglify        = require('gulp-uglify');
var fs            = require('file-system');

var events = require('events'),
    emmitter = new events.EventEmitter(),
    path = require('path');

var reporter = function(file, cb) {
    return map(function(file, cb) {
        if (!file.jshint.success) {
            file.jshint.results.forEach(function(err) {
                if (err) {
                    var msg = [
                        path.basename(file.path),
                        'Line: ' + err.error.line,
                        'Error: ' + err.error.reason
                    ];
                    emmitter.emit('error', new Error(msg.join('\n')));
                }
            });
        }
        cb(null, file);
    });
};

/**
 * Compile our Sass. This currently uses the gulp-ruby-sass however, once Inuit
 * supports lib-sass, this should be used instead as it's 5000x quicker.
 */
gulp.task('sass', function() {
    return sass('resource/sass', {
            style: 'compressed'
        })
        .pipe(replace('/*!', '/*'))
        .pipe(sourcemaps.write('maps', {
            includeContent: false,
            sourceRoot: 'source'
        }))
        .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .on('error', notify.onError())
        .pipe(gulp.dest('build/css'))
        .pipe(notify("SCSS compiled: <%=file.relative%>"))
        .pipe(livereload());
});

/**
 * Concatenate, lint and compress our JavaScript
 */
gulp.task('scripts', ['build-modernizr', 'external-scripts'], function() {
    return gulp.src('resource/js/*.js')
        .pipe(concat('global.js'))
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter(jshintstylish))
        .on('error', notify.onError(function(error) {
            return error.message;
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(notify("JS compiled: <%=file.relative%>"))
        .pipe(livereload());
});

/**
 * Create a custom modernizr build by scanning the JS files for references to
 * modernizr. We can also use require('config.json') as a parameter to explictly
 * pass in a config.
 */
gulp.task('build-modernizr', () => {
    gulp.src('resource/js/*.js')
        .pipe(modernizr('modernizr.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
})

/**
 * Add external scripts from bower here. The reason this is seperate is to
 * remove the usage of JSHint (we don't want to see errors we can't fix).
 */
gulp.task('external-scripts', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(livereload());
});

/**
 * Compress our images. This removes meta data and other unwanted information
 * from our images to ensure they are web-ready and can be the lowest possible
 * size. This is important when transferring things over the web where the user
 * has a slow or limited internet connection. This plugin also supports SVGs.
 */
gulp.task('images', function() {
    return gulp.src([
            'resource/img/**/*.*',
            '!resource/img/sprites/*.*'
        ])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                { removeViewBox: true },
                { removeUselessDefs: true },
                { removeUselessStrokeAndFill: true }
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

/**
 * Delete the sprites file from the sass directory
 */
gulp.task('sprites', ['move-sprites'], function() {
    return del('resource/sass/sprites.svg');
});

/**
 * Move sprite SVG from the sass directory into the img directory
 */
gulp.task('move-sprites', ['generate-sprites'], function() {
    return gulp.src('resource/sass/sprites.svg')
        .pipe(gulp.dest('build/img'));
});

/**
 * This generates a sprite svg symbol file. It also creates the CSS required
 * for these sprites which will be relative to the sprite filename. This
 * function works with streaming so will follow a backwards path for its
 * dependancy functions.
 */
gulp.task('generate-sprites', function () {
  return gulp.src('resource/img/sprites/*.svg')
    .pipe(svgsymbols({
        svgClassname: 'svg-icons',
        id: 'icon-%f',
        className: '.icon-%f svg',
        templates: [
            'default-svg',
            path.join(__dirname, 'resource/sass/_sprite-template.scss')
        ]
    }))
    .pipe(rename(function(path) {
        if (path.extname === '.scss') {
            path.basename = 'components/_components.sprites';
        } else {
            path.basename = 'sprites';
        }
    }))
    .pipe(header('/**\n * DO NOT EDIT THIS FILE DIRECTLY.\n * This file is automatically generated from resource/img/sprites/*.svg\n * and resource/sass/_sprite-template.scss.\n */'))
    .pipe(gulp.dest('resource/sass'));
});

/**
 * Clear the .sass-cache directory
 *
 * This function may only need to be used a handful of times, but can sort any
 * issues when compiling stylesheets with includes.
 */
gulp.task('clear-sass-cache', function() {
    return del('.sass-cache/*', function(paths) {
        console.log('Files deleted:\n', paths.join('\n'));
    });
});

/**
 * Reload WordPress template files
 *
 * Makes working on front end changes quicker with livereload.
 */
gulp.task('templates', function() {
    return gulp.src([
            'templates/**/*.php',
            'header.php',
            'footer.php'
        ])
        .pipe(livereload());
});

/**
 * Compiles acf-migrations code into export.php file
 * This is only run on development - live environments use the .phar file directly
 */
gulp.task('acf', shell.task([
    'php acf-migrations.phar -t ' + __dirname
]));

/*
* Move local fonts to our build directory
*/
gulp.task('fonts', function() {
    return gulp.src('resource/fonts/*')
        .pipe(gulp.dest('build/fonts/'));
});

/**
 * Our watch script. Watches for changes in files to run the relevant
 * function that compiles the required code.
 */
 gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('resource/sass/*.scss', ['sass']);
    gulp.watch('resource/js/*.js', ['scripts']);
    gulp.watch('resource/img/sprites/*.svg', ['sprites']);
    gulp.watch('resource/img/**/*.*', ['images']);
    gulp.watch([
        'templates/**/*.php',
        'header.php',
        'footer.php'
    ], ['templates']);
    gulp.watch('acf/migrations.php', ['acf']);
    gulp.watch('resource/fonts/*', ['fonts']);
});

/**
 * Build task (runs when running `gulp build` from the command line)
 *
 * This is used as a shortcut for the default task but mainly to seperate out
 * the compiling processes and return a finished output (without including The
 * watch task). This also deals with running gulp tasks in order.
 *
 * We split out build-production so ACF is not called on the live environments.
 */
gulp.task('build', ['build-production'], function(cb) {
    runsequence('acf', cb);
});

gulp.task('build-production', function(cb) {
    runsequence('sprites', ['sass', 'scripts', 'images', 'fonts'], cb);
})

/**
 * Deployment task (runs when running `gulp deploy` from the command line)
 *
 * This is used as a shortcut for the default task but mainly to seperate any
 * deployment specific commands, such as the uploading of assets to S3. This is
 * used during deployment within a container. This also does not include the
 * watch task.
 */
gulp.task('deploy', ['build-production'], function() {

    if (!fs.existsSync('credentials.json')) {
        console.log('Credentials file does not exist. Cannot deploy assets to Amazon S3.');
        return;
    }

    var credentials = require('./credentials.json'),
        s3 = require('gulp-s3-upload')(credentials);

    gulp.src('build/**/*')
        .pipe(s3({
            Bucket: credentials.bucket,
            ACL: 'public-read',
            Metadata: {
                'Cache-Control': 'max-age = 302400'
            },
            Expires: expires,
            keyTransform: function(filename) {
                return 'build/' + filename;
            }
        }, { maxRetries: 5 }));
});

/**
 * Default task (runs when running `gulp` from the command line)
 *
 * Each of these functions can also be run individually from the command line
 * by using `gulp {function}`. Taking the clear-sass-cache function as an
 * example, you would run `gulp clear-sass-cache` from the command line.
 */
gulp.task('default', function(cb) {
    runsequence('build', 'watch', cb);
});
