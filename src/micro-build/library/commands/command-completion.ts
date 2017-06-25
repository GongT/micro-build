import {CommandParser} from "./argument-parser/index";
import {optSwitchProject} from "./command-microbuild";
import {switchProjectFromArguments} from "../common/paths";

export function handleCompletion() {
	const comp_parser = new CommandParser;
	comp_parser.commandName('microbuild');
	
	comp_parser.addOption(optSwitchProject);
	
	comp_parser.addCommand('completion').aliases('complete');
	
	try {
		comp_parser.parse();
	} catch (e) {
		return false;
	}
	
	if (!comp_parser.result.next) {
		return false;
	}
	if (comp_parser.result.next.name !== 'completion') {
		return false;
	}
	
	switchProjectFromArguments(comp_parser.result);
	
	return true;
}
