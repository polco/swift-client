import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as debug from 'debug-logger';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ip from 'ip';
import * as path from 'path';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as webpack from 'webpack';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isDev = env === 'development';

const log = debug('swift');
log('create webpack configuration');

function isExternal(module: any) {
	return module.context && module.context.includes('node_modules');
}

const serverEndPoint = isDev
	? `https://${ip.address()}:${process.env.PORT || 3434}`
	: 'https://swift-gateway.herokuapp.com';
const publicPath = isDev ? './' : 'https://polco.github.io/swift-client/';

log(`Socket server end point will be ${serverEndPoint}`);

const plugins: webpack.Plugin[] = [
	new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true  }),
	new webpack.NamedModulesPlugin(),
	new webpack.optimize.CommonsChunkPlugin({
		chunks: ['desktop-app'],
		minChunks: isExternal,
		name: 'desktop-vendor'
	}),
	new webpack.optimize.CommonsChunkPlugin({
		chunks: ['desktop-app', 'desktop-vendor'],
		minChunks: Infinity,
		name: 'desktop-bootstrap'
	}),
	new webpack.optimize.CommonsChunkPlugin({
		chunks: ['mobile-app'],
		minChunks: isExternal,
		name: 'mobile-vendor'
	}),
	new webpack.optimize.CommonsChunkPlugin({
		chunks: ['mobile-app', 'mobile-vendor'],
		minChunks: Infinity,
		name: 'mobile-bootstrap'
	}),
	new HtmlWebpackPlugin({
		chunks: ['desktop-bootstrap', 'desktop-vendor', 'desktop-app', 'mobile-bootstrap', 'mobile-vendor', 'mobile-app'],
		inject: false,
		minify: {
			collapseWhitespace: !isDev
		},
		template: path.join('src', 'index.html')
	}),
	new webpack.DefinePlugin({
		__SOCKET_END_POINT__: JSON.stringify(serverEndPoint),
		__IS_DEV__: JSON.stringify(isDev)
	}),
	new ExtractTextPlugin({
		filename: isDev ? '[name].css' : '[name].[chunkhash].css'
	}),
	new CopyWebpackPlugin([{ from: 'src/index.css' }])
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
	plugins.push(new webpack.HotModuleReplacementPlugin());
}

const desktopEntry = './src/desktop/app.tsx';
const mobileEntry = './src/mobile/app.tsx';

const webpackConfig: webpack.Configuration = {
	target: 'web',
	devtool: 'source-map',
	cache: true,
	resolve: {
		modules: ['src', 'node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	node: {
		fs: 'empty'
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				include: /src/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
			{
				test: /\.less$/,
				include: /src/,
				use: ExtractTextPlugin.extract({
					use: [
						{ loader: 'css-loader', options: { sourceMap: true, importLoaders: 2, root: publicPath } },
						{ loader: 'postcss-loader', options: { sourceMap: true } },
						{ loader: 'less-loader', options: { sourceMap: true } }
					],
					publicPath
				})
			},
		]
	},
	entry: {
		'desktop-app': desktopEntry,
		'mobile-app': mobileEntry,
	},
	output: {
		publicPath,
		path: path.join(__dirname, 'dist'),
		filename: isDev ? '[name].js' : '[name].[chunkhash].js'
	},
	plugins
};

export default webpackConfig;
