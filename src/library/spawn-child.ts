import {spawnSync} from "child_process";
import {getTempPath, getProjectPath} from "./file-paths";
import {resolve} from "path";

export function spawnMainCommand(command, args: string[] = []) {
	const fullPath = resolve(getTempPath(), command);
	console.log('[microbuild][spawn-child] %s [%s]', fullPath, args.join(', '));
	const ret = spawnSync(fullPath, args, {
		cwd: getProjectPath(),
		stdio: 'inherit',
		env: process.env,
		encoding: 'utf8'
	});
	if (ret.error) {
		console.error(ret.error.message);
	}
	return ret.status;
}
