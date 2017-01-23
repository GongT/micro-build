import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnRun} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'run',
	description: '/* run */',
	builder(parser){
		parser.addParam('...args')
		      .description('program start arguments');
	},
};

export function run(...args: string[]) {
	mkconfig();
	
	return spawnRun('-d --restart=always', args);
}
