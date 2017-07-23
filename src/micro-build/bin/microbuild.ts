/// <reference path="../globals.d.ts"/>

import {escapeRegExp} from "@gongt/ts-stl-library/strings/escape-regexp";
import {createErrorStackHint} from "../../../../typescript-common-library/build-package/library/strings/hint-error-stack";
import {ArgumentError} from "../library/commands/argument-parser/base";
import {createBashCompletion} from "../library/commands/argument-parser/bash-completion";
import {UsageHelper} from "../library/commands/argument-parser/help";
import {handleCompletion} from "../library/commands/command-completion";
import {parser} from "../library/commands/command-microbuild";
import {folderExists, writeFile} from "../library/common/filesystem";
import {__} from "../library/common/my-i18n";
import {DEBUG_MICROBUILD_SOURCE, PathResolver} from "../library/common/paths";
import {loadApplicationConfigs} from "../library/config/application-config";
import {ConfigFile} from "../library/config/config-file";
import {runCommand} from "./command-switch";
import {die, exit, ExitCode, ExitStatus, programSection, programSectionEnd} from "./error";

const path: PathResolver = new PathResolver;

export default async function () {
	await loadApplicationConfigs();
	
	programSection('handle bash completion');
	if (handleCompletion()) {
		const x = createBashCompletion(parser);
		writeFile('/etc/bash_completion.d/microbuild', x);
		console.log('source /etc/bash_completion.d/microbuild ; echo "auto complete loaded." >&2');
		
		if (!folderExists(path.project)) {
			die('project directory do not exists: %s', path.project);
		}
		process.exit(0);
	}
	programSectionEnd();
	
	programSection('parse command line');
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
	programSectionEnd();
	
	const args = parser.result;
	path.switchProjectFromArguments(args);
	
	const config = new ConfigFile(path);
	await config.reload();
	
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
	} else if (args.next.name === 'init') {
		programSection('create folder structure');
		path.ensure();
		programSectionEnd();
	} else if (!config.exists) {
		throw new ExitStatus(ExitCode.config_exists, '`' + path.project + '` not a project root');
	}
	
	try {
		await runCommand(config, args);
	} catch (err) {
		let errorLines: number = Infinity;
		if (err.stringify) {
			console.error(err.stringify());
			errorLines = 3;
		} else if (err.code) {
			console.error(`Error ${err.code}:\n\t${err.message}`);
		} else {
			console.error(`Error ${err.name}:\n\t${err.message}`);
		}
		const r = new RegExp(escapeRegExp(DEBUG_MICROBUILD_SOURCE), 'g');
		const debugStack = createErrorStackHint(err.stack, errorLines, 1)
			.join('\n').replace(r, '@MB');
		throw new ExitStatus(err.code || 1, debugStack);
	}
}
