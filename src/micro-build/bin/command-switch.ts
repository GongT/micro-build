import {mkdirSync} from "fs";
import {resolve} from "path";
import {NormalizedArguments} from "../library/commands/argument-parser/real-parse";
import {die} from "../library/common/cli-process";
import {getPathConfigFile, getPathConfigPath} from "../library/common/paths";
import {ConfigFile} from "../library/config/config-file";

export function runCommand(args: NormalizedArguments) {
	const topCommand = args.nextConfig;
	switch (topCommand.name) {
	case 'init':
		mkdirSync(resolve(getPathConfigPath()));
		
		const config = new ConfigFile(getPathConfigFile());
		if (config.exists) {
			console.error('config file exists.');
			return;
		}
		
		// TODO copy example config
		// console.log(args)
		
		break;
	default:
		//	pluginCommand(args);
		die(`unknown top level command: `, topCommand.name);
	}
}
