const dev_url = 'http://192.168.1.54';

const path = require('path');
const webpack = require("webpack");
const PACKAGE = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: './src/index.js',
    },

    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'dev'),
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: `./src/index.html`,
            filename: `index.html`,
            inject: true,
            minify: false,
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new webpack.DefinePlugin({
            SETTINGS_V: JSON.stringify(PACKAGE.version),
            SETTINGS_DEV_URL: JSON.stringify(dev_url),
        }),
    ],

    devServer: {
        watchFiles: ['src/*.html'],
        static: path.resolve(__dirname, './dev'),
        hot: true,
        open: true,
    },

    watchOptions: {
        poll: 1000,
        ignored: '/node_modules/',
    },

    mode: 'development',
};