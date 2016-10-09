import {spawnMainCommand} from "../library/spawn-child";
import mkconfig from "./mkconfig";

export default function script(this: any) {
	mkconfig.apply({}, arguments);
	
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // script
	
	return spawnMainCommand('run-script.sh', args);
}
