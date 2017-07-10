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
		}],
		loaders: [{
			test: require.resolve('snapsvg'),
			loader: 'imports-loader?this=window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
		}]	
	},
	devServer: {
		contentBase: resolve(__dirname, './example')
	}
};
