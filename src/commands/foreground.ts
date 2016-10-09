import {spawnRun} from "../library/spawn-child";
import mkconfig from "./mkconfig";

export default function foreground(this: any) {
	mkconfig.apply({}, arguments);
	
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // foreground
	
	return spawnRun('--restart=no', args);
}
