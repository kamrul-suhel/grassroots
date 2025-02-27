const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './js/client',
        './sass/layout.scss',
    ],
    output: {
        path: path.join(__dirname, 'build', 'js'),
        filename: 'bundle.js',
        publicPath: '/js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            app: path.resolve(__dirname, './js/common'),
        },
    },
    optimization: {
        nodeEnv: 'development',
    },
    plugins: [
        /**
         * This is where the magic happens! You need this to enable Hot Module Replacement!
         */
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: 'babel-loader',
                include: path.join(__dirname, 'js'),
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000&minetype=application/font-woff',
            },
            {
                test: /\.(ttf|eot|otf|svg|jpg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader',
            },
            {
                test: /\.scss?/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
                include: path.join(__dirname, 'sass'),
            },
        ],
    },
};
