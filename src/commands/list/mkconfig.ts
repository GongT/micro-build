import {CommandDefine} from "../command-library";
import {update} from "./update";
import {createDockerBuildFiles} from "../../build/build-scripts";
import {switchEnvironment} from "../../library/common/runenv";
import {createDebugScript} from "../../build/debug-script";
import {createServiceFile} from "../../build/service-supports";
import {createPlugins} from "../../build/create-plugins";

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
	if (debug) {
		switchEnvironment('host');
		update();
		createDebugScript();
	}
	if (build) {
		switchEnvironment('docker');
		update();
		createDockerBuildFiles();
		createServiceFile();
		/*if(isInstalled()){
		 reinstall();
		 }*/
	}
	createPlugins();
}
