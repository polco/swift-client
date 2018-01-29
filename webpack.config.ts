import * as webpack from 'webpack';
import * as debug from 'debug-logger';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isDev = env === 'development';

const log = debug('swift');
log('create webpack configuration');

function isExternal(module: any) {
	return module.context && module.context.includes("node_modules");
}

const plugins: webpack.Plugin[] = [
	new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true  }),
	new webpack.NamedModulesPlugin(),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'desktop-vendor',
		chunks: ['desktop-app'],
		minChunks: isExternal
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'desktop-bootstrap',
		chunks: ['desktop-app', 'desktop-vendor'],
		minChunks: Infinity
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'mobile-vendor',
		chunks: ['mobile-app'],
		minChunks: isExternal
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'mobile-bootstrap',
		chunks: ['mobile-app', 'mobile-vendor'],
		minChunks: Infinity
	}),
	new HtmlWebpackPlugin({
		template: path.join('src', 'index.html'),
		inject: false,
		chunks: ['desktop-bootstrap', 'desktop-vendor', 'desktop-app', 'mobile-bootstrap', 'mobile-vendor', 'mobile-app'],
		minify: {
			collapseWhitespace: !isDev
		}
	})
];

if (!isDev) {
	log('Apply UglifyJS plugin.');
	plugins.push(
		new UglifyJsPlugin({
			parallel: 3,
			sourceMap: true,
			uglifyOptions: { ecma: 6 }
		})
	);
} else {
	new webpack.HotModuleReplacementPlugin();
}


const webpackConfig: webpack.Configuration = {
	target: 'web',
	devtool: 'source-map',
	cache: true,
	resolve: {
		modules: ['src', 'node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				include: /src/,
				exclude: /node_modules/,
				use: 'ts-loader',
			}
		]
	},
	entry: {
		'desktop-app': './src/desktop/app.tsx',
		'mobile-app': './src/mobile/app.tsx',
	},
	output: {
		publicPath: isDev ? './' : 'https://polco.github.io/swift-client/',
		path: path.join(__dirname, 'dist'),
		filename: isDev ? '[name].js' : '[name].[chunkhash].js'
	},
	plugins
};

export default webpackConfig;
