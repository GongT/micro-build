/// <reference path="./globals.d.ts"/>
import {parser} from "./library/commands/command-microbuild";
import {UsageHelper} from "./library/commands/argument-parser/help";
import {__} from "./library/common/i18n";
import {ArgumentError} from "./library/commands/argument-parser/base";
import {exit} from "./bin";
import {createBashCompletion} from "./library/commands/argument-parser/bash-completion";
import {writeFile} from "./library/file-operation/fs";

try {
	parser.parse(process.argv.slice(2));
} catch (e) {
	if (e instanceof ArgumentError) {
		new UsageHelper(parser).error(e);
		exit(1);
	} else {
		throw e;
	}
}
const args = parser.result;
if (!args.next || args.namedOptions.help) {
	if (args.next) {
		let itr = args;
		while (itr.next && itr.next.nextConfig) {
			itr = itr.next;
		}
		new UsageHelper(itr.nextConfig).print(1);
	} else {
		console.log('\n    [Micro Build] %s.\n', __('main.description'));
		new UsageHelper(parser).print(0);
	}
}

const x = createBashCompletion(parser);
writeFile('/etc/bash_completion.d/microbuild', x);
