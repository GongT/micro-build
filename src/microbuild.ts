#!/usr/bin/env node

try {
	if (require('os').platform() === 'darwin') {
		process.stdout['_handle'].setBlocking(true)
	}
} catch (e) {
}

import {displayError} from "./library/common/display-error";
require("source-map-support/register");
process.on('uncaughtException', (err) => {
	displayError(err.stack);
	process.exit(1);
});
require('./bin');
