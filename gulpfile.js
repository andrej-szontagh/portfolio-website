
// NPM + GULP >> for dummies
// https://css-tricks.com/gulp-for-beginners/

// NPM config >> even more recent
// https://www.npmjs.com/package/gulp-useref

// TODO: remove packages that are not used

var gulp                = require ('gulp');
var gulp_sass           = require ('gulp-sass');
var gulp_clean_css      = require ('gulp-clean-css');
var gulp_terser         = require ('gulp-terser');
var gulp_pug            = require ('gulp-pug');
var gulp_html_minifier  = require ('gulp-html-minifier');
var gulp_concat         = require ('gulp-concat');
var gulp_sequence       = require ('gulp-sequence');
var gulp_svgmin         = require ('gulp-svgmin');
var gulp_svgstore       = require ('gulp-svgstore');
var pump                = require ('pump');
var pumpify             = require ('pumpify');
var browser_sync        = require ('browser-sync').create ();

gulp.task ('default', function () {

  // place code for your default task here
});

// build combined and minified CSS file >> /dist
gulp.task ('sass', function () {

    return gulp.src (['src/css/styles.scss'], { base: 'src/css' })
        .pipe (gulp_concat      ('styles.scss'))
        .pipe (gulp_sass        ())
        .pipe (gulp_clean_css   ())
        .pipe (gulp.dest        ('dist'));
});

// build combined CSS file >> /dist
gulp.task ('sass-debug', function () {

    return gulp.src (['src/css/styles.scss'], { base: 'src/css' })
        .pipe (gulp_concat      ('styles.scss'))
        .pipe (gulp_sass        ())
        .pipe (gulp.dest        ('dist'));
});

// optimize svg files and combine into 'svg.svg' file >> /dist
gulp.task ('svg', function () {

  return gulp.src ('src/svg/*.svg')
    .pipe (gulp_svgstore    ({ inlineSvg: true }))
    .pipe (gulp_svgmin      ({

        plugins: [
            { removeUselessDefs:    false },
            { cleanupIDs:           false },
            { cleanupNumericValues: { floatPrecision: 2 }}
        ],

        //js2svg: { pretty: true }
    }))
    .pipe (gulp.dest ('dist'));
});

function js_concat (cb) {

    return pumpify  ([
        gulp.src    ([

            'src/js/lib/Utils.js',
            'src/js/lib/Animations.js',
            'src/js/lib/YouTube.js',

            'src/js/ContentBase.js',
            'src/js/ContentCrop.js',
            'src/js/ContentZoom.js',
            'src/js/Content.js',

            'src/js/Gallery.js',
            'src/js/GalleryVideos.js',
            'src/js/GalleryImages.js',
            'src/js/GalleryLightbox.js',

            'src/js/ButtonsBase.js',
            'src/js/ButtonsState.js',
            'src/js/ButtonsActions.js',
            'src/js/ButtonsEvents.js',
            'src/js/Buttons.js',

            'src/js/Mechanics.js',
            'src/js/Entry.js',
        ]),
        gulp_concat ('scripts.js'),
        gulp.dest   ('dist')
    ], cb);
}

// build concatenated JS file >> /dist
gulp.task ('js-concat', function (cb) {

    return js_concat (cb);
});

// build minified JS file >> /dist
gulp.task ('js-minify', function (cb) {

    return gulp.src ('dist/scripts.js')
        .pipe (gulp_terser ({
            module:             true,
            toplevel:           true,
            keep_classnames:    false,
            keep_fnames:        false,
            mangle: {
                toplevel:           true,
                keep_classnames:    false,
                keep_fnames:        false,
            }
        }))
        .pipe (gulp.dest ('dist'));
});

// build optimized html file >> /dist
gulp.task ('html', function () {

    return gulp.src ('index.pug')

        .pipe (gulp_pug ({ locals : { debug: false }}))

        /* https://github.com/kangax/html-minifier */
        .pipe (gulp_html_minifier ({

            collapseWhitespace: true,
            removeComments:     true,
            minifyCSS:          true,
            minifyJS:           true
        }))

        .pipe (gulp.dest ('dist'));
});

// build html file >> /dist
gulp.task ('html-debug', function () {

    return gulp.src ('index.pug')

        .pipe (gulp_pug ({ pretty : true, locals : { debug: true }}))
        .pipe (gulp.dest ('dist'));
});

// copy remaining files into >> /dist
gulp.task ('data', function () {

    gulp.src ('src/data/**/*'   ).pipe (gulp.dest ('dist/data'));
    gulp.src ('src/root/*.*'    ).pipe (gulp.dest ('dist'));

    //    return gulp_merge (
    //
    //        gulp.src ('src/data/**/*'   ).pipe (gulp.dest ('dist/data')),
    //        gulp.src ('src/root/*.*'    ).pipe (gulp.dest ('dist'))
    //    );
});

gulp.task ('serve', [], () => {

    // https://browsersync.io/docs/gulp

    browser_sync.init ({

        server: {

           baseDir: "./dist",
        },
        port:               5000,
        reloadOnRestart:    true,
      //browser:            "google chrome"
    });

    // Auto reload ..
    // gulp.watch ("dist/**/*").on ('change', browser_sync.reload);
});

// working only since gulp version 4 !
// gulp.task ('build', gulp.series ('sass', 'uglify', 'html'));

gulp.task ('build-css',         gulp_sequence ('sass'));
gulp.task ('build-css_debug',   gulp_sequence ('sass-debug'));
gulp.task ('build-html',        gulp_sequence ([                'svg',  'js-concat'],   'js-minify',            'html'));
gulp.task ('build-html_debug',  gulp_sequence ([                'svg',  'js-concat'],                           'html-debug'));
gulp.task ('build',             gulp_sequence (['sass',         'svg',  'js-concat'],   'js-minify',    'data', 'html'));
gulp.task ('build-debug',       gulp_sequence (['sass-debug',   'svg',  'js-concat'],                   'data', 'html-debug'));
