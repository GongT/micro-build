import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnMainCommand} from "../../library/system/spawn/spawn-child";
import {switchEnvironment} from "../../library/common/runenv";
import {createServiceConfig} from "../../build/service-files";

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
	switchEnvironment('host');
	
	mkconfig(false, true);
	
	createServiceConfig();
	
	const ret = spawnMainCommand('debug.sh', args);
	console.error('bye~');
	return ret;
}
