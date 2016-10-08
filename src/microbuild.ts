/// <reference path="../typings/index.d.ts" />
/// <reference path="../global.d.ts" />

import "source-map-support/register";
import * as commander from "commander";
import {commandList} from "./commands/all";
import {tempDirName} from "./library/file-paths";

const {version} = require("../package.json");

const requiredItems = [];

let currentActionName;
export function currentAction() {
	return currentActionName;
}

commander.version(version);
commander.usage('<command> [arguments...]');
commander.allowUnknownOption(false);

commander.command('init [target]')
         .allowUnknownOption(false)
         .description(`create "${tempDirName}" in current working dir (or in target).`)
         .action(call_command);

commander.command('build [args...]')
         .allowUnknownOption(true)
         .description('build image in current working dir')
         .action(call_command);

commander.command('install')
         .allowUnknownOption(false)
         .description('install built image as system service, auto start on boot.')
         .action(call_command);

commander.command('uninstall')
         .allowUnknownOption(false)
         .description('stop and uninstall system service.')
         .action(call_command);

commander.command('service <operation>')
         .allowUnknownOption(false)
         .description('control system service.')
         .action(call_command);

commander.command('debug [args...]')
         .allowUnknownOption(true)
         .description('run script on host machine. arguments will pass to starup command.')
         .action(call_command);

commander.command('mkconfig [args...]')
         .allowUnknownOption(false)
         .description('create build script for debug.')
         .action(call_command);

commander.command('clean')
         .allowUnknownOption(false)
         .description('remove temp files.')
         .action(call_command);

commander.action(function (command) {
	commander.unknownOption(command);
});

commander.parse(process.argv);

commander.outputHelp();
process.exit(1);

function call_command(...args) {
	const command = args.pop();
	const commandName = currentActionName = command.name();
	
	requiredItems.forEach((item) => {
		if (!command[item]) {
			command.outputHelp();
			command.missingArgument(item);
			process.exit(1);
		}
	});
	
	const fn = commandList[commandName];
	try {
		const ret = fn.apply(command, args);
		if (fn && fn.then) {
			ret.then((ret) => {
				return ret;
			}, (e) => {
				throw e;
			});
		} else {
			process.exit(ret || 0);
		}
	} catch (e) {
		console.error(e.stack);
		process.exit(9);
	}
}

function required(n: string, cb = undefined) {
	requiredItems.push(n);
	return cb;
}
