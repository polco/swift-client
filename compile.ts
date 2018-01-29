import * as _debug from 'debug-logger';
import compilerConfig from './webpack.config';
import * as webpack from 'webpack';

const compiler = webpack(compilerConfig);

const debug = _debug('swift:compile');
debug.log('Create webpack compiler.');

compiler.run(function(err, stats) {
	if (err) {
		debug.error('Webpack compiler encountered a fatal error.');
		throw err;
	}

	const jsonStats = stats.toJson();

	debug.log('Webpack compile completed.');

	if (jsonStats.errors.length > 0) {
		debug.error('Webpack compiler encountered errors.');
		throw jsonStats.errors;
	} else if (jsonStats.warnings.length > 0) {
		debug.log('Webpack compiler encountered warnings.');
	} else {
		debug.log('No errors or warnings encountered.');
	}
});
