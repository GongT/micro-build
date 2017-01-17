import {spawnMainCommand} from "../library/spawn-child";
import mkconfig from "./mkconfig";

export default function debug(this: any) {
	process.env.MICRO_BUILD_RUN = 'debug';
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // debug
	
	mkconfig.apply({}, arguments);
	
	const ret = spawnMainCommand('debug.sh', args);
	console.log('bye~');
	return ret;
}
