import {spawnRun} from "../library/spawn-child";
import mkconfig from "./mkconfig";

export default function run(this: any) {
	mkconfig.apply({}, arguments);
	
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // run
	
	return spawnRun('-d --restart=always', args);
}
