const path = require('path');

module.exports = config => {
    config.set({
        singleRun: !!process.env.CI,

        browsers: !!process.env.CI ? ['ChromeHeadless'] : ['Chrome'],

        frameworks: ['mocha', 'chai'],

        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },

        files: ['test/index.ts'],

        preprocessors: {
            'test/index.ts': ['webpack']
        },

        colors: true,

        autoWatch: true,

        webpackMiddleware: {
            noInfo: true,
            stats: 'errors-only'
        },
        webpack: {
            mode: 'development',
            entry: './src/index.ts',
            output: {
                filename: '[name].js'
            },
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                configFile: 'tsconfig.json'
                            }
                        },
                        exclude: [path.join(__dirname, 'node_modules')]
                    }
                ]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.json']
            }
        }
    })
}
