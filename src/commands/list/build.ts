import {CommandDefine} from "../command-library";
import {readBuildConfig} from "../../library/read-config";
import {spawnMainCommand} from "../../library/system/spawn/spawn-child";
import {clean} from "./clean";
import {updateCurrentDir} from "../../library/common/file-paths";
import {defaultEnvironment} from "../../library/common/runenv";
import {mkconfig} from "./mkconfig";

export const commandDefine: CommandDefine = {
	command: 'build',
	aliases: ['b'],
	description: '在当前目录中生成docker-image',
	builder(parser){
		parser.addParam('...args')
		      .description('docker build arguments');
	},
};

export function build(...args) {
	console.log('\x1Bc');
	clean();
	
	updateCurrentDir('./');
	mkconfig(true, false);
	
	defaultEnvironment('docker');
	const ret = spawnMainCommand('build.sh', args);
	if (ret !== 0) {
		console.error('\x1B[38;5;9m%s build failed...\x1B[0m', readBuildConfig().toJSON().projectName);
	}
	return ret;
}
