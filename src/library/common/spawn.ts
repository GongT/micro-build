import {spawnSync, SpawnSyncOptions} from "child_process";
import {getPathProject} from "../paths";

export function runExternalCommand(cmd: string, args: string[] = [], options: SpawnSyncOptions = {}) {
	if (options.env) {
		Object.assign(options.env, process.env);
	}
	const p = spawnSync(cmd, args, Object.assign({
		encoding: 'utf8',
		cwd: getPathProject(),
		stdio: ['inherit', 'pipe', 'inherit'],
		env: process.env,
		shell: '/bin/bash',
	}, options));
	
	if (p.error) {
		throw p.error;
	}
	
	return p.stdout;
}
