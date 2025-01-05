const cfg = require('./webpack.config.js');
const path = require('path');
const webpack = require("webpack");
const PACKAGE = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
    },

    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'dist/single'),
        clean: true,
        publicPath: '',
    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: cfg.keep_classnames,
                    keep_fnames: cfg.keep_fnames,
                },
            }),
        ],
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            // {
            //     test: /\.(?:js|mjs|cjs)$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             targets: "last 5 years",
            //             presets: [
            //                 ['@babel/preset-env']
            //             ]
            //         }
            //     }
            // }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: `./src/index.html`,
            filename: `index.html`,
            inject: true,
        }),
        new HtmlInlineScriptPlugin({
            htmlMatchPattern: [/index.html$/],
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new webpack.DefinePlugin({
            SETTINGS_V: JSON.stringify(PACKAGE.version),
        }),
        new HTMLInlineCSSWebpackPlugin(),
    ],

    mode: 'production',
};