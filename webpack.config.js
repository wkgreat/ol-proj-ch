const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ol-proj-ch.js',
        library: 'ol-proj-ch',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    devtool: 'inline-source-map',
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components|test)/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js' ]
    },
};
