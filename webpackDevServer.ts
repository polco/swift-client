import * as _debug from 'debug-logger';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import compilerConfig from './webpack.config';

const debug = _debug('swift');
const compiler = webpack(compilerConfig);

const server = new WebpackDevServer(compiler, {
	publicPath: '/',
	watchOptions: {
		// poll: true,
		aggregateTimeout: 300
	},
	https: true,
	hot: false,
	lazy: false,
	historyApiFallback: true,
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
});

server.listen(8080, function(error) {
	if (error) {
		return debug(error);
	}
	debug('Webpack server listening on port 8080');
});
