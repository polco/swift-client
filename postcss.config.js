var cssnano = require('cssnano');

module.exports = {
	plugins: [
		cssnano({
			sourcemap: true,
			autoprefixer: { remove: true },
			safe: true,
			discardComments: {
				removeAll: true
			}
		})
	]
};
