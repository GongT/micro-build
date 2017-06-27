import {spawnSync, SpawnSyncOptions} from "child_process";
import {PathResolver} from "./paths";

export function runExternalCommand(pr: PathResolver, commands: string[] = [], options: SpawnSyncOptions = {}) {
	if (options.env) {
		Object.assign(options.env, process.env);
	}
	const [cmd, ...args] = commands;
	const p = spawnSync(cmd, args, Object.assign({
		encoding: 'utf8',
		cwd: pr.project,
		stdio: ['inherit', 'pipe', 'inherit'],
		env: process.env,
		shell: '/bin/bash',
	}, options));
	
	if (p.error) {
		throw p.error;
	}
	
	return p.stdout;
}
