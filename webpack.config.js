const webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
	context: resolve(__dirname, './src'),
	entry: {
		app: './app.js'
	},
	output: {
		path: resolve(__dirname, './dist'),
		filename: '[name].bundle.js',
		publicPath: '/js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: [/node_modules/],
			use: [{
				loader: 'babel-loader',
				options: { presets: ['es2015'] }
			}]
		}]	
	},
	devServer: {
		contentBase: resolve(__dirname, './example')
	}
};
