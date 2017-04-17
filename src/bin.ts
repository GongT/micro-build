/// <reference path="./globals.d.ts"/>
import {parser} from "./library/commands/command-library";
import {UsageHelper} from "./library/commands/argument-parser/help";

const argv = process.argv.slice(2);
const args = parser.parse(argv);

if (args.namedOptions['help']) {
	if (args.next) {
		new UsageHelper(args.nextConfig).print();
	} else {
		console.log('\n    [Micro Build] is a collection of tools, to build micro-service with docker.\n');
		parser.usageInstance().print();
	}
}

parser.addCommand('init').addParam('location').defaultValue('.');
const create = parser.addCommand('create');
create.addCommand('dockerfile');
create.addCommand('service');
create.addCommand('basic');

parser.addCommand('run');
parser.addCommand('debug');

const service = parser.addCommand('service');
service.addCommand('status');
service.addCommand('install');
service.addCommand('uninstall');

const control = service.addCommand('start');
control.addCommand('restart');
control.addCommand('stop');
control.addCommand('reset');
control.addCommand('kill');

parser.addCommand('logs').aliases('log')
      .addOption('f').defaultValue(true).notAcceptValue();
parser.addCommand('build');

if (!args.next) {
	parser.usageInstance().error(new Error('Command is required'));
}

/*
 if (args.namedParams['project']) {
 updateCurrentDir(args.namedParams['project']);
 }
 
 callCommandFunction(args.nextConfig, args.next);
 */
