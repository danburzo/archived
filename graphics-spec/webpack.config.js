module.exports = {
	entry: './src/index.js',
	output: {
		filename: './dist/bundle.js'
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};