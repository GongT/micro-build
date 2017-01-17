import update from "./update";
import {spawnMainCommand} from "../library/spawn-child";
import {createBuildTempFiles, readBuildConfig} from "../build/all";

export default function build(this: any) {
	process.env.MICRO_BUILD_RUN = 'build';
	const args = Array.prototype.slice.call(this.parent.rawArgs);
	args.shift(); // node
	args.shift(); // microbuild
	args.shift(); // debug
	
	update();
	
	const builder = readBuildConfig();
	createBuildTempFiles(builder);
	
	const ret = spawnMainCommand('build.sh', args);
	if (ret !== 0) {
		console.error('\x1B[38;5;9m%s build failed...\x1B[0m', builder.toJSON().projectName);
	}
	return ret;
}
