import {NormalizedArguments} from "../library/commands/argument-parser/real-parse";
import {handleBuild} from "./actions/build";
import {handleCreateFile} from "./actions/create";
import {handleInit} from "./actions/init";
import {handleRun} from "./actions/run";
import {config} from "./prepare";

export enum ExitCode{
	success = 0,
	input,
	config_exists,
	config_error,
}
export class ExitStatus extends Error {
	constructor(public readonly code: ExitCode, message: string) {
		super(message);
	}
	
	stringify() {
		return `\nError \x1B[38;5;11m${ExitCode[this.code]}\x1B[0m:\n\t${this.message}`;
	}
}

export async function runCommand(args: NormalizedArguments): Promise<void> {
	const topCommand = args.nextConfig;
	switch (topCommand.name) {
	case 'init':
		return await handleInit(config, topCommand);
	case 'create':
		return await handleCreateFile(config, topCommand);
	case 'build':
		return await handleBuild(config, topCommand);
	case 'run':
		return await handleRun(config, topCommand);
	default:
		throw new ExitStatus(ExitCode.input, `unknown top level command: ${topCommand.name}`)
		//	pluginCommand(args);
	}
}
