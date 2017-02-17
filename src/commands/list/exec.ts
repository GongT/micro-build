import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnMainCommand} from "../../library/system/spawn/spawn-child";
import {switchEnvironment} from "../../library/common/runenv";

export const commandDefine: CommandDefine = {
	command: 'exec',
	description: '/* exec */',
};

export function exec(...args) {
	switchEnvironment('docker');
	mkconfig(true, false);
	
	return spawnMainCommand('run-script.sh', args);
}
