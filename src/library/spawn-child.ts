import {spawnSync} from "child_process";
import {getTempPath, getProjectPath} from "./file-paths";
import {resolve} from "path";
import extend = require("extend");

export function spawnMainCommand(command, args: string[] = []) {
	const fullPath = resolve(getTempPath(), command);
	console.log('[microbuild][spawn-child] %s [%s]', fullPath, args.join(', '));
	console.log('');
	const ret = spawnSync(fullPath, args, {
		cwd: getProjectPath(),
		stdio: 'inherit',
		env: process.env,
		encoding: 'utf8',
		shell: '/bin/bash',
	});
	if (ret.error) {
		console.error(ret.error.message);
	}
	return ret.status;
}

export function spawnRun(docker_env: string, args: string[] = []) {
	const fullPath = resolve(getTempPath(), 'start.sh');
	console.log('[microbuild][spawn-child] %s [%s]', fullPath, args.join(', '));
	console.log('');
	const ret = spawnSync(fullPath, args, {
		cwd: getProjectPath(),
		stdio: 'inherit',
		env: extend({}, process.env, {
			DOCKER_START_ARGS: docker_env
		}),
		encoding: 'utf8',
		shell: '/bin/bash',
	});
	if (ret.error) {
		console.error(ret.error.message);
	}
	return ret.status;
}
