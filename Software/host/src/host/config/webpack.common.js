﻿var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    context: helpers.root('./app'),
    entry: {
        'app': './main.ts',
        'polyfills': './polyfills.ts',
        'vendor': './vendor.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js'] // Try .ts first, otherwise map will reference .js file.
    },

    module: {
        loaders: [
          {
              test: /\.ts$/,
              loaders: ['awesome-typescript-loader', 'angular2-template-loader']
          },
          {
              test: /\.html$/,
              loader: 'html'
          },
          {
              test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
              loader: 'file?name=assets/[name].[hash].[ext]'
          },
          {
              test: /\.css$/,
              exclude: helpers.root('src', 'app'),
              loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
          },
          {
              test: /\.css$/,
              include: helpers.root('src', 'app'),
              loader: 'raw'
          }
        ]
    },

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
          name: ['app', 'vendor', 'polyfills']
      }),

      new HtmlWebpackPlugin({
          template: 'index.html'
      }),

      new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          jquery: 'jquery'
      })
    ]
};