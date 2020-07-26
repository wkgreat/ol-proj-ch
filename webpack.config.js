const path = require('path');

module.exports = {
    entry: './src/proj/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ol-proj-ch.js',
        library: 'ol-proj-ch',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};