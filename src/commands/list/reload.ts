import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {readBuildConfig} from "../../build/all";
import {spawnMainCommand} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'reload',
	description: '/* reload */',
};

export function reload(this: any) {
	mkconfig.apply({}, arguments);
	
	const builder = readBuildConfig();
	const reload = builder.toJSON().reloadCommand;
	
	if (reload.length === 0) {
		console.error('no reload script defined');
		return 1;
	}
	
	return spawnMainCommand('run-script.sh', reload);
}
