import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnRun} from "../../library/system/spawn/spawn-child";
import {defaultEnvironment} from "../../library/common/runenv";

export const commandDefine: CommandDefine = {
	command: 'run',
	description: '/* run */',
	builder(parser){
		parser.addParam('...args')
		      .description('program start arguments');
	},
};

export function run(...args: string[]) {
	defaultEnvironment('docker');
	mkconfig();
	
	return spawnRun('-d --restart=always', args);
}
