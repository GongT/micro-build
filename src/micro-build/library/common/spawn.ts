import {spawnSync, SpawnSyncOptions} from "child_process";
import {PathResolver} from "./paths";

export function runExternalCommand(pr: PathResolver, commands: string[] = [], options: SpawnSyncOptions = {}): [number, string] {
	if (options.env) {
		Object.assign(options.env, process.env);
	}
	const [cmd, ...args] = commands;
	console.error("\x1B[2m%s %s\x1B[0m", cmd, args.join(" "));
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
	
	return [p.status, p.stdout.toString('utf8')];
}
