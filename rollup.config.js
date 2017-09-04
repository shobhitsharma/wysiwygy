import bundle from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const config = {
  name: bundle.name,
  version: bundle.version,
  author: bundle.author,
  production: (process.env.NODE_ENV === 'production'),
  src: __dirname + '/src',
  dist: __dirname + '/dist'
};

export default {
  moduleName: config.name,
  entry: config.src + '/index.js',
  dest: config.dist + '/' + config.name + '.min.js',
  format: 'iife',
  sourceMap: true,
  globals: {
    window: 'window',
    WYSIWYGY: 'WYSIWYG'
  },
  plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		config.production && uglify() // minify, but only in production
	]
}