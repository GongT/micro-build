import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {defaultEnvironment} from "../../library/common/runenv";
import {readBuildConfig} from "../../library/read-config";
import {spawnMainCommand} from "../../library/system/spawn/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'reload',
	description: '/* reload */',
};

export function reload(this: any) {
	defaultEnvironment('docker');
	mkconfig();
	
	const builder = readBuildConfig();
	const reload = builder.toJSON().reloadCommand;
	
	if (reload.length === 0) {
		console.error('no reload script defined');
		return 1;
	}
	
	return spawnMainCommand('run-script.sh', reload);
}
