import {spawnSync} from "child_process";
import {getTempPath, getProjectPath} from "./file-paths";
import {resolve} from "path";

export function spawnMainCommand(command) {
	const fullPath = resolve(getTempPath(), command);
	const ret = spawnSync(fullPath, {
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
