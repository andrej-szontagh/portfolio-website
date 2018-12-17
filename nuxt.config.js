const pkg = require('./package')

module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },

    /*
    ** Global CSS
    */
    css: [

        // https://hackernoon.com/how-i-use-scss-variables-mixins-functions-globally-in-nuxt-js-projects-while-compiling-css-utilit-58bb6ff30438
        'assets/css/_global.scss'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [

        [

            // https://hackernoon.com/how-i-use-scss-variables-mixins-functions-globally-in-nuxt-js-projects-while-compiling-css-utilit-58bb6ff30438
            'nuxt-sass-resources-loader', 
            [
                'assets/css/_global.scss'
            ]
        ],
        [
            // https://github.com/vanhoofmaarten/nuxt-mq
            'nuxt-mq',
            {
                // Default breakpoint for SSR
                defaultBreakpoint: 1600,

                breakpoints: {
                    50:     50,
                    100:    100,
                    200:    200,
                    300:    200,
                    400:    400,
                    500:    500,
                    600:    600,
                    800:    800,
                    1000:   1000,
                    1200:   1200,
                    1400:   1400,
                    1600:   1600,
                    1800:   1800,
                    2000:   2000,
                    2500:   2500,
                    3000:   3000,
                    4000:   4000,
                }
            }
        ]
    ],

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
}
