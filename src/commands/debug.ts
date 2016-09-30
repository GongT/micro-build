import {createDebugScript} from "../build/debug-script";
import {readBuildConfig} from "../build/all";
import {spawnMainCommand} from "../library/spawn-child";

export default function debug(this: any) {
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // debug
	
	const builder = readBuildConfig();
	
	createDebugScript(builder);
	
	return spawnMainCommand('debug.sh');
}
