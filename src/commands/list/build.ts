import {CommandDefine} from "../command-library";
import {updateCurrentDir} from "../../library/file-paths";
import {update} from "./update";
import {readBuildConfig, createBuildTempFiles} from "../../build/all";
import {spawnMainCommand} from "../../library/spawn-child";

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
	updateCurrentDir('./');
	process.env.MICRO_BUILD_RUN = 'build';
	
	update();
	
	const builder = readBuildConfig();
	createBuildTempFiles(builder);
	
	const ret = spawnMainCommand('build.sh', args);
	if (ret !== 0) {
		console.error('\x1B[38;5;9m%s build failed...\x1B[0m', builder.toJSON().projectName);
	}
	return ret;
}
