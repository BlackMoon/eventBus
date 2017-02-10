var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'app': './app/index.ts',
        'polyfills': './app/polyfills.ts',
        'vendor': './app/vendor.ts'
    },

    resolve: {
        alias: { 'jquery-ui': 'jquery-ui-bundle' },
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
              loader: 'to-string!css-loader'
          }
        ]
    },

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
          name: ['app', 'vendor', 'polyfills']
      }),

      new CopyWebpackPlugin([
          { from: './node_modules/jquery/dist/jquery.min.js' },
          { from: './node_modules/jquery-ui-bundle/jquery-ui.min.js' },
          { from: './node_modules/ignite-ui/js/infragistics.core-lite.js' },
          { from: './node_modules/ignite-ui/js/infragistics.lob-lite.js' }
      ]),

      new HtmlWebpackPlugin({
          template: './app/index.html'
      }),

      new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          jquery: 'jquery'
      })
    ]
};