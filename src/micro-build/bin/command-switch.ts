import {NormalizedArguments} from "../library/commands/argument-parser/real-parse";
import {die} from "../library/common/cli-process";
import {ConfigFile} from "../library/config/config-file";
import {pr} from "./prepare";

export function runCommand(args: NormalizedArguments) {
	const topCommand = args.nextConfig;
	switch (topCommand.name) {
	case 'init':
		
		const config = new ConfigFile(pr);
		if (config.exists) {
			console.error('config file exists.');
			return;
		}
		
		// TODO copy example config
		// console.log(args)
		
		break;
	case 'create':
		break;
	case 'build':
		break;
	case 'run':
		break;
	default:
		//	pluginCommand(args);
		die(`unknown top level command: `, topCommand.name);
	}
}
