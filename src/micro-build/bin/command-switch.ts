import {mkdirSync} from "fs";
import {NormalizedArguments} from "../library/commands/argument-parser/real-parse";
import {resolve} from "path";
import {getPathConfigPath} from "../library/paths";
import {die} from "./bin";

export function runCommand(args: NormalizedArguments) {
	const topCommand = args.nextConfig;
	switch (topCommand.name) {
	case 'init':
		mkdirSync(resolve(getPathConfigPath()));
		
		
		// console.log(args)
		
		break;
	default:
		//	pluginCommand(args);
		die(`unknown top level command: `, topCommand.name);
	}
}
