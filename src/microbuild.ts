/// <reference path="../typings/index.d.ts" />
/// <reference path="../global.d.ts" />

import {resolve} from "path";
import {realpathSync} from "fs";
import "source-map-support/register";
import * as commander from "commander";
import {commandList} from "./commands/all";

const {version} = require("../package.json");

const requiredItems = [];

export const projectPath = realpathSync(process.cwd());
export const tempDirName = '_micro_build';
export const tempPath = resolve(projectPath, tempDirName);
export const defaultPath = resolve(tempPath, 'config.ts');

commander.version(version);
commander.usage('<command> [arguments...]');
commander.allowUnknownOption(false);

commander.command('init [target]')
         .allowUnknownOption(false)
         .description('create `microservice.json` in current working dir.')
         .action(call_command);

commander.command('*')
         .action(function (command) {
	         commander.unknownOption(command);
         });

commander.parse(process.argv);

commander.outputHelp();
process.exit(1);

function call_command(...args) {
	const command = args.pop();
	const commandName = command.name();
	
	requiredItems.forEach((item) => {
		if (!command[item]) {
			command.outputHelp();
			command.missingArgument(item);
			process.exit(1);
		}
	});
	
	const fn = commandList[commandName];
	try {
		const ret = fn.call(command, args);
		process.exit(ret || 0);
	} catch (e) {
		console.error(e.stack);
		process.exit(9);
	}
}

function required(n: string, cb = undefined) {
	requiredItems.push(n);
	return cb;
}
