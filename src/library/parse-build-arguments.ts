import {MicroBuildConfig} from "./microbuild-config";
import {Command} from "commander";
import extend = require("extend");
export function parseBuildArguments(action: string, builder: MicroBuildConfig, _args: any) {
	let argDef = builder.toJSON().arguments;
	const args: string[] = ['node', 'microbuild ' + action].concat(_args);
	
	const commander = new Command;
	const required = [], build = [], run = [];
	
	Object.keys(argDef).forEach((name) => {
		const arg = argDef[name];
		if (arg.runArg) {
			run.push(name);
		} else {
			build.push(name);
		}
		if (arg.defaultValue === null) {
			required.push(name);
			commander.option(`--${name} <value>`, `${arg.desc} (required)`);
		} else {
			commander.option(`--${name} <value>`, `${arg.desc} (default=${arg.defaultValue})`, arg.defaultValue);
		}
	});
	
	commander.allowUnknownOption(false);
	
	commander.parse(args);
	
	required.forEach((name) => {
		if (!commander[name]) {
			const help = commander.helpInformation()
			                      .replace(/^\s*-h, --help\s+output usage information\s*$/m, '');
			console.error('');
			console.error(help.trim());
			commander.missingArgument(name);
			process.exit(1);
		}
	});
	
	return {
		get runCommandline() {
			return run.map((name) => {
				return `--${name} ${JSON.stringify(commander[name])}`;
			});
		},
		get commandline() {
			return build.concat(run).map((name) => {
				return `--${name} ${JSON.stringify(commander[name])}`;
			});
		},
	};
}

export function help_message(builder: MicroBuildConfig) {
	const commander = new Command;
	let argDef = builder.toJSON().arguments;
	
	Object.keys(argDef).forEach((name) => {
		const arg = argDef[name];
		if (arg.defaultValue === null) {
			commander.option(`--${name} <value>`, `${arg.desc} (required)`);
		} else {
			commander.option(`--${name} <value>`, `${arg.desc} (default=${arg.defaultValue})`, arg.defaultValue);
		}
	});
	
	return commander.helpInformation()
	                .replace(/^\s*-h, --help\s+output usage information\s*$/m, '')
	                .trim();
}
