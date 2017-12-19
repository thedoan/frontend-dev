const webpack = require('webpack');
const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginOptions = {
	title: 'DIO Design Home Page',
	template: 'src/templates/index.ejs',
	mobile: true,
}
const HtmlWebpackPluginNavigationOptions = {
	title: 'Navigation Design',
	template: 'src/templates/navigation.ejs',
	filename: 'navigation.html'
}
const HtmlWebpackPluginNavigationOptions2 = {
	// Required
	inject: false,
	title: 'Navigation Design With BEM',
	template: 'src/templates/navigation_bem.ejs',
	filename: 'navigation_bem.html',
	mobile: true,
}

const extractSass = new ExtractTextPlugin({
	filename: "[name].[contenthash].css",
	disable: process.env.NODE_ENV === "development"
});

module.exports = {
	entry:{
		vendor: ["jquery"],
		main:	'./src/main.js',
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
	},
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: "[name].bundle.js",
		publicPath: '/',
	},
	plugins: [ 
		extractSass,
		new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
		new HtmlWebpackPlugin(HtmlWebpackPluginNavigationOptions),
		new HtmlWebpackPlugin(HtmlWebpackPluginNavigationOptions2),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name:'vendor',
		}),
	],
	module: {
		rules: [
		{
			test: /\.css$/,
			use: [ 
			{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader' 
			},
			{
				loader: 'resolve-url-loader'
			}
			]
		}
		,{
			test: /\.scss$/,
			use: extractSass.extract({
				use: [
				{
					loader: "css-loader"
				},
				{
					loader: "resolve-url-loader",
				},
				{
					loader: "sass-loader",
					options: {
						sourceMap: true,
						data: "$env: " + process.env.NODE_ENV + ";"
					}
				}
				],
				// use style-loader in development
				fallback: "style-loader"
			})
		},
		{
			test: /\.(png|jpg|gif)$/,
			use: [
			{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				}  
			}
			]		
		},
		{
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: [
			{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}  
			}
			]		
		},
		{
			test: /\.ejs$/,
			use: [
			{
				loader: 'ejs-compiled-loader',
				options: {}
			}
			]
		}
		]
	}
}
