import {hintErrorStack} from "@gongt/ts-stl-library/strings/hint-error-stack";
import {pathExistsSync} from "fs-extra";
import {resolve} from "path";
import "source-map-support/register";
import "../library/common/my-i18n";

process.on('unhandledRejection', function (reason, p) {
	console.log("unhandledRejection! %s", reason);
	p.catch((e) => {
		setImmediate(() => {
			throw e; // quit running
		});
	});
});

if (!process.env.DBG) {
	process.on('uncaughtException', (err) => {
		hintErrorStack(err.stack);
		process.exit(1);
	});
}
const selfPackage = resolve(__dirname, '../../package.json')
if (pathExistsSync(selfPackage)) {
	const notifier = require('update-notifier')({
		pkg: require(selfPackage),
		name: 'microbuild',
		updateCheckInterval: 1000 * 60 * 60 * 12,
	});
	notifier.notify({
		defer: true,
	});
	
	if (notifier.update) {
		console.log(`Update available: ${notifier.update.latest}`);
	}
}

setImmediate(() => {
	require('./prepare');
	require('./microbuild');
});
