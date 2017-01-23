import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnMainCommand} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'exec',
	description: '/* exec */',
};

export function exec(...args) {
	mkconfig();
	
	return spawnMainCommand('run-script.sh', args);
}
