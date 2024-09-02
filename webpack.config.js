const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        index: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.CALCULATOR_APP_BACKEND_URL': 
                JSON.stringify(process.env.CALCULATOR_APP_BACKEND_URL) || 
                JSON.stringify('http://localhost:3000')
        })
    ],
    devServer: {
        static: './dist',
        port: process.env.PORT || 8080,
        allowedHosts: 'all'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        parser: {
            css: {
                namedExports: true
            }
        },
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }],
                            ['@babel/preset-react']
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, 
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
