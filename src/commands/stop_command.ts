import {spawnMainCommand} from "../library/spawn-child";
import mkconfig from "./mkconfig";
import {readBuildConfig} from "../build/all";

export default function stop_command(this: any) {
	mkconfig.apply({}, arguments);
	
	const builder = readBuildConfig();
	
	return spawnMainCommand('run-script.sh', builder.toJSON().stopCommand);
}
