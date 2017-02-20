import {CommandDefine} from "../command-library";
import {update} from "./update";
import {createDockerBuildFiles} from "../../build/build-scripts";
import {defaultEnvironment} from "../../library/common/runenv";
import {createDebugScript} from "../../build/debug-script";
import {createPlugins} from "../../build/create-plugins";
import {createPublicFiles} from "../../build/public-gen";
import {readBuildConfig} from "../../library/read-config";
import {createServiceControl} from "../../build/service-files";

export const commandDefine: CommandDefine = {
	command: 'mkconfig',
	description: 'Create main scripts & Dockerfile & so on.',
	builder(parser){
		parser.addOption('build')
		      .notAcceptValue()
		      .defaultValue(true)
		      .description('make build mode config files.');
		parser.addOption('debug')
		      .aliases('d')
		      .notAcceptValue()
		      .defaultValue(true)
		      .description('make debug mode config files.');
	},
};

let buildMake = false;
let debugMake = false;
export function mkconfig(build: boolean = true, debug: boolean = false) {
	if (buildMake && debugMake) {
		return;
	}
	console.error('\x1B[38;5;14m+ test config files: \x1B[0m');
	defaultEnvironment('docker');
	readBuildConfig();
	
	console.error('\x1B[38;5;14m+ update micro-build config files: \x1B[0m');
	update();
	
	console.error('\x1B[38;5;14m+ create files for all: \x1B[0m');
	createPublicFiles();
	createServiceControl();
	
	if (debug && !debugMake) {
		debugMake = true;
		console.error('\x1B[38;5;14m+ create files for debug: \x1B[0m');
		createDebugScript();
	}
	if (build && !buildMake) {
		buildMake = true;
		console.error('\x1B[38;5;14m+ create files for build: \x1B[0m');
		createPlugins();
		createDockerBuildFiles();
	}
	console.error('config files created!');
}
