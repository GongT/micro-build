import {spawnMainCommand} from "../library/spawn-child";
import mkconfig from "./mkconfig";
import {readBuildConfig} from "../build/all";

export default function reload(this: any) {
	mkconfig.apply({}, arguments);
	
	const builder = readBuildConfig();
	const reload = builder.toJSON().reloadCommand;
	
	if (reload.length === 0) {
		console.error('no reload script defined');
		return 1;
	}
	
	return spawnMainCommand('run-script.sh', reload);
}
