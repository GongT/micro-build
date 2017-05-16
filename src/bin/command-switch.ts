import {NormalizedArguments} from "library/commands/argument-parser/real-parse";
import {switchProjectFromArguments} from "../library/paths";

export function runCommand(args: NormalizedArguments) {
	switchProjectFromArguments(args);
	
	
	switch (args.nextConfig.name) {
	case '':
		break;
	default:
		//	pluginCommand(args);
	}
	
	console.log(args)
}
