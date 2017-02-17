import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {createForegroundTestScript} from "../../build/foreground-test";
import {switchEnvironment} from "../../library/common/runenv";
import {readBuildConfig} from "../../library/read-config";
import {spawnRun} from "../../library/system/spawn/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'foreground',
	description: 'start docker container in foreground (for debugging).',
	builder(parser){
		parser.addOption('map-root')
		      .notAcceptValue()
		      .aliases('m')
		      .description('map current directory to /data');
		parser.addOption('entrypoint')
		      .acceptValue()
		      .defaultValue(undefined)
		      .aliases('e')
		      .description('overwrite `shellCommand` in build.config.ts');
		parser.addOption('shell')
		      .acceptValue()
		      .defaultValue(false)
		      .description('equals --entrypoint=/bin/sh');
		parser.addParam('...commands')
		      .description('program start arguments');
	},
};

export function foreground(this: any, entrypoint: string = undefined, image: string = '', shell: boolean = false, map_root: boolean = false, ...commands: string[]) {
	switchEnvironment('docker');
	const builder = readBuildConfig();
	builder.dockerRunArgument('--rm');
	if (entrypoint !== undefined) {
		builder.dockerRunArgument('--entrypoint=' + entrypoint);
	} else if (shell) {
		if (shell === true) {
			if (builder.toJSON().base.indexOf('alpine') === -1) {
				builder.dockerRunArgument('--entrypoint=/bin/bash');
			} else {
				builder.dockerRunArgument('--entrypoint=/bin/sh');
			}
		} else {
			builder.dockerRunArgument('--entrypoint=' + shell);
		}
	}
	if (map_root) {
		builder.volume('./', '/data');
		if (!shell) {
			if (builder.toJSON().base.indexOf('alpine') === -1) {
				builder.shellCommand('/bin/bash');
			} else {
				builder.shellCommand('/bin/sh');
			}
		}
		builder.startupCommand('--login', '-i');
		
		mkconfig();
		createForegroundTestScript(builder);
		
		console.log("\0x1B]0;${PROJECT_NAME} - MICRO-BUILD: foreground testing ...\x07");
		
		return spawnRun('--restart=no', commands, {
			START_DOCKER_IMAGE_NAME: image || ''
		}, 'foreground-test/run-foreground.sh');
	} else {
		console.log("\0x1B]0;${PROJECT_NAME} - MICRO-BUILD: foreground running ...\x07");
		
		mkconfig();
		
		return spawnRun('--restart=no', commands, {
			START_DOCKER_IMAGE_NAME: image || ''
		});
	}
}
