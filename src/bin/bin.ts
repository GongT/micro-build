#!/usr/bin/env node
import "source-map-support/register";
import "../library/common/my-i18n";
import {resolve} from "path";

import {displayError} from "../library/common/display-error";

process.on('unhandledRejection', function (reason, p) {
	console.log("unhandledRejection! %s", reason);
	p.catch((e) => {
		setImmediate(() => {
			throw e; // quit running
		});
	});
});

process.on('uncaughtException', (err) => {
	displayError(err.stack);
	process.exit(1);
});

const notifier = require('update-notifier')({
	pkg: require(resolve(__dirname, '../package.json')),
	name: 'microbuild',
	updateCheckInterval: 1000 * 60 * 60 * 12
});
notifier.notify({
	defer: true,
});

if (notifier.update) {
	console.log(`Update available: ${notifier.update.latest}`);
}

export function die(...args: any[]) {
	console.error.apply(console, args);
	exit(1);
}

export function exit(e: any = 0) {
	if (typeof e === 'number') {
		process.exit(e);
	} else {
		console.error(e);
		process.exit(1);
	}
}

setImmediate(() => {
	require('./microbuild');
});
