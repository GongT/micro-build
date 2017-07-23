import {NormalizedArguments} from "../library/commands/argument-parser/real-parse";
import {MB_COMMAND} from "../library/commands/command-microbuild";
import {ConfigFile} from "../library/config/config-file";
import {handleBuild} from "./actions/build";
import {handleControl} from "./actions/control";
import {handleCreateFile} from "./actions/create";
import {handleInit} from "./actions/init";
import {handleRun} from "./actions/run";
import {ExitCode, ExitStatus} from "./error";

export async function runCommand(config: ConfigFile, args: NormalizedArguments): Promise<void> {
	const topCommand = args.nextConfig;
	switch (topCommand.name) {
	case MB_COMMAND.INIT:
		return await handleInit(config, topCommand);
	case MB_COMMAND.CREATE:
		return await handleCreateFile(config, topCommand);
	case MB_COMMAND.BUILD:
		return await handleBuild(config, topCommand);
	case MB_COMMAND.RUN:
		return await handleRun(config, topCommand);
	case MB_COMMAND.CONTROL:
		return await handleControl(config, topCommand);
	default:
		//	pluginCommand(args);
		throw new ExitStatus(ExitCode.input, `unknown top level command: ${topCommand.name}`)
	}
}
