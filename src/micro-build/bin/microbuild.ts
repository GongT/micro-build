/// <reference path="../globals.d.ts"/>

import {ArgumentError} from "../library/commands/argument-parser/base";
import {createBashCompletion} from "../library/commands/argument-parser/bash-completion";
import {UsageHelper} from "../library/commands/argument-parser/help";
import {handleCompletion} from "../library/commands/command-completion";
import {parser} from "../library/commands/command-microbuild";
import {die, exit} from "../library/common/cli-process";
import {folderExists, writeFile} from "../library/common/filesystem";
import {__} from "../library/common/my-i18n";
import {runCommand} from "./command-switch";
import {pr} from "./prepare";

const needHandleCompletion = handleCompletion();

if (needHandleCompletion) {
	const x = createBashCompletion(parser);
	writeFile('/etc/bash_completion.d/microbuild', x);
	console.log('source /etc/bash_completion.d/microbuild ; echo "auto complete loaded." >&2');
	
	if (!folderExists(pr.project)) {
		die('project directory do not exists: %s', pr.project);
	}
	process.exit(0);
}

try {
	parser.parse();
} catch (e) {
	if (e instanceof ArgumentError) {
		new UsageHelper(parser).error(e);
		exit(1);
	} else {
		throw e;
	}
}

const args = parser.result;
pr.switchProjectFromArguments(args);

if (!args.next || args.namedOptions.help) {
	if (args.next) {
		let itr = args;
		while (itr.next && itr.next.nextConfig) {
			itr = itr.next;
		}
		throw new UsageHelper(itr.nextConfig).print(1);
	} else {
		console.log('\n    [Micro Build] %s.\n', __('main.description'));
		throw new UsageHelper(parser).print(0);
	}
}

if (!folderExists(pr.project)) {
	if (args.next.name === 'init') {
		pr.ensure();
	} else {
		die('project directory do not exists: %s', pr.project);
	}
}

runCommand(args);
