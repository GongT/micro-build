import {CommandDefine} from "../command-library";
import {update} from "./update";
import {readBuildConfig, createBuildTempFiles} from "../../build/all";

export const commandDefine: CommandDefine = {
	command: 'mkconfig',
	description: 'Create main scripts & Dockerfile & so on.',
	builder(parser){
		parser.addOption('build')
		      .notAcceptValue()
		      .defaultValue(true)
		      .description('build mode (default).');
		parser.addOption('debug')
		      .aliases('d')
		      .notAcceptValue()
		      .defaultValue(false)
		      .description('debug mode.');
	},
};

export function mkconfig(build: boolean = false, debug: boolean = false) {
	if (build) {
		process.env.MICRO_BUILD_RUN = 'build';
	}
	if (debug) {
		process.env.MICRO_BUILD_RUN = 'debug';
	}
	update();
	
	const builder = readBuildConfig();
	
	return createBuildTempFiles(builder);
}
