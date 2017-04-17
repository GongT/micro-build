#!/usr/bin/env node

(async () => {
	if (require('fs').existsSync('dist/bundle.js')) {
		const System = require('systemjs');
		const data = await System.import('./dist/bundle.js');
		console.log(data);
	} else {
		require('ts-node/register');
		require('./src/microbuild.ts');
	}
})();
