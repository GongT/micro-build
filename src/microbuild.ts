/// <reference path="./globals.d.ts"/>
import {parser} from "./library/commands/command-microbuild";
import {UsageHelper} from "./library/commands/argument-parser/help";
import {__} from "./library/common/i18n";

const argv = process.argv.slice(2);

/*
 if (args.namedParams['project']) {
 updateCurrentDir(args.namedParams['project']);
 }
 
 callCommandFunction(args.nextConfig, args.next);
 */

const args = parser.parse(argv);
if (!args.next || args.namedOptions.help) {
	if (args.next) {
		let itr = args.next;
		while (itr.next && itr.next.nextConfig) {
			itr = itr.next;
		}
		new UsageHelper(itr.nextConfig).print();
	} else {
		console.log('\n    [Micro Build] %s.\n', __('main.description'));
		parser.usageInstance().print();
	}
}

