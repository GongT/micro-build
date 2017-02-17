import {CommandDefine} from "../command-library";
import {update} from "./update";
import {readBuildConfig} from "../../library/read-config";
import {spawnMainCommand} from "../../library/system/spawn/spawn-child";
import {createDockerBuildFiles} from "../../build/build-scripts";
import {clean} from "./clean";
import {updateCurrentDir} from "../../library/common/file-paths";
import {defaultEnvironment} from "../../library/common/runenv";

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
	defaultEnvironment('docker');
	updateCurrentDir('./');
	
	clean();
	update();
	
	createDockerBuildFiles();
	
	const ret = spawnMainCommand('build.sh', args);
	if (ret !== 0) {
		console.error('\x1B[38;5;9m%s build failed...\x1B[0m', readBuildConfig().toJSON().projectName);
	}
	return ret;
}
