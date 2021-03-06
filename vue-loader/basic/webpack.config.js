let path = require('path');
let webpack = require('webpack');
let isProduction = process.env.NODE_ENV === 'production';
const ExtractModule = require('./modules/extract-module');
const docsExtract = new ExtractModule('docs.md');
const styleExtract = new ExtractModule({
	filename: 'style.css'
});

	if (isProduction) {
		return ExtractTextPlugin.extract({
			use: styles,
			fallback: 'vue-style-loader'
		});
	} else {
		console.log('-------------');
		console.log(['vue-style-loader'].concat(styles));
		return ['vue-style-loader'].concat(styles);
	}
};
const docsExtract = new ExtractTextPlugin('docs.md');
const lessExtract = new ExtractTextPlugin('less.css');
const styleExtract = new ExtractTextPlugin('style.css');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'build.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				enforce: 'pre',
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						'css': generateStyleLoaders(false, isProduction),
						// 'less': generateStyleLoaders('less', isProduction)
						'docs': isProduction ? docsExtract.extract('raw-loader') : ''
					},
					sourceMap: isProduction
					// other vue-loader options go here
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/m
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			}
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true
	},
	performance: {
		hints: false
	},
	plugins: [
	],
	devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map';

	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new ExtractTextPlugin({
			filename: 'style.css'
		}),
		docsExtract,
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
