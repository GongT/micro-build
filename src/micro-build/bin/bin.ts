import {pathExistsSync} from "fs-extra";
import {resolve} from "path";
import "source-map-support/register";
import "../library/common/my-i18n";
import {criticalErrorHandler, exit, handleError, programSection, programSectionEnd} from "./error";

programSection('early init');

process.on('unhandledRejection', function (reason, p) {
	console.log("unhandledRejection! %s", reason);
	p.catch((e) => {
		setImmediate(() => {
			throw e; // quit running
		});
	});
});

process.on('uncaughtException', (err) => {
	exit(handleError(err))
});

const selfPackage = resolve(__dirname, '../../package.json');
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

programSectionEnd();

setImmediate(() => {
	programSection('load source code');
	const main = require('./microbuild').default;
	programSectionEnd();
	
	main().catch(criticalErrorHandler);
});
