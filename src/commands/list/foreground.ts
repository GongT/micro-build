import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {readBuildConfig} from "../../build/all";
import {spawnRun} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'foreground',
	description: 'start docker container in foreground (for debugging).',
	builder(parser){
		parser.addParam('...args')
		      .description('program start arguments');
	},
};

export function foreground(this: any, ...args) {
	const builder = readBuildConfig();
	builder.dockerRunArgument('--rm');
	
	mkconfig();
	
	return spawnRun('--restart=no', args);
}
