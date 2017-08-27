/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let namespace = 'wysiwyg';
let sourceDir = __dirname + '/src';
let distDir = __dirname + '/dist';

let plugins = [],
  outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({
    minimize: true
  }));
  outputFile = namespace + '.min.js';
} else {
  outputFile = namespace + '.js';
}

const rules = [
  {
    test: /(\.jsx|\.js)$/,
    loader: 'babel-loader',
    exclude: /(node_modules|bower_components)/
  },
  {
    test: /(\.jsx|\.js)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
  }
];

const config = {
  entry: sourceDir + '/index.js',
  devtool: 'source-map',
  output: {
    path: distDir,
    filename: outputFile,
    library: namespace,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: rules
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins
};

module.exports = config;
