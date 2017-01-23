import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnMainCommand} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'debug',
	aliases: ['d'],
	description: '调试模式启动当前目录中的项目，而不使用docker',
	builder(parser){
		parser.addParam('...args')
		      .description('program start arguments');
	},
};

export function debug(...args: any[]) {
	process.env.MICRO_BUILD_RUN = 'debug';
	
	mkconfig();
	
	const ret = spawnMainCommand('debug.sh', args);
	console.log('bye~');
	return ret;
}
