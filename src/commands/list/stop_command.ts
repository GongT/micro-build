import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {readBuildConfig} from "../../build/all";
import {spawnMainCommand} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'stop-command',
	description: null,
};

export function stop_command() {
	mkconfig();
	
	const builder = readBuildConfig();
	
	return spawnMainCommand('run-script.sh', builder.toJSON().stopCommand);
}
