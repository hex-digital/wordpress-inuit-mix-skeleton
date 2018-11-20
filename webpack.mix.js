let mix = require('laravel-mix');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const resourcePath = 'resources';
const buildPath = 'build';

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application.
 |
 */

mix
    .sass(`${resourcePath}/sass/main.scss`, `${buildPath}/css/main.css`)
    .options({
        processCssUrls: false
    })

    .js(`${resourcePath}/js/**/*.js`, `${buildPath}/js/global.js`)
    .extract([
        'jquery'
    ])

    .copyDirectory(`${resourcePath}/fonts`, `${buildPath}/fonts`);

    // mix.browserSync({
    //     proxy: 'skeleton.local'
    // })

mix.webpackConfig({
    plugins: [
        new CopyWebpackPlugin([{
            from: `${resourcePath}/img`,
            to: `${buildPath}/img`,
            test: /\.(jpe?g|png|gif|svg)$/i,
        }]),
        new SVGSpritemapPlugin({
            src: `${resourcePath}/sprites/**/*.svg`,
            filename : `${buildPath}/sprites/sprites.svg`,
            prefix : 'icon-',
            svgo : { removeTitle : true },
        }),
        // SETUP INSTRUCTION: If acf is required, uncomment the below
        // new WebpackShellPlugin({
        //     onBuildExit: ['php acf-migrations.phar -t ' + __dirname]
        // })
    ],
});

// Put all Development only config here
if (! mix.inProduction()) {
    mix
        .webpackConfig({
            module: {
                rules: [
                    {
                        enforce: 'pre',
                        test: /\.(js)$/,
                        exclude: /node_modules/,
                        loader: 'eslint-loader'
                    },
                ],
            },
            plugins: [
                new StyleLintPlugin({
                    configFile: '.stylelintrc',
                    context: `${resourcePath}/sass`
                }),
            ]
        })
};

// Put all Production only config here
if (mix.inProduction()) {
    mix
        .disableNotifications()
        .webpackConfig({
            plugins: [
                new ImageminPlugin({
                    cacheFolder: `./${buildPath}/img`,
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    pngquant: {
                        quality: '65-80'
                    },
//                     plugins: [
//                         imageminMozjpeg({
//                             quality: 65,
//                             // Set the maximum memory to use in kbytes
//                             maxMemory: 1000 * 512
//                         })
//                     ]
                })
            ],
        })
};
