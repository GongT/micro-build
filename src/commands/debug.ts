import {spawnMainCommand} from "../library/spawn-child";
import mkconfig from "./mkconfig";

export default function debug(this: any) {
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // debug
	
	mkconfig.apply({}, arguments);
	
	return spawnMainCommand('debug.sh', args);
}
