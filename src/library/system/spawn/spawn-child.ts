import {spawnSync} from "child_process";
import {basename, resolve} from "path";
import {getProjectPath, getTempPath} from "../../common/file-paths";
import extend = require("extend");

export function spawnExternalCommand(command, args: string[] = []) {
	const ret = spawnSyncWrap(command, args, {
		cwd: getProjectPath(),
		stdio: 'inherit',
		env: process.env,
		encoding: 'utf8',
		shell: '/bin/bash',
	});
	return ret.status;
}
export function spawnMainCommand(command, args: string[] = []) {
	const fullPath = resolve(getTempPath(), command);
	const ret = spawnSyncWrap(fullPath, args, {
		cwd: getProjectPath(),
		stdio: 'inherit',
		env: Object.assign({}, process.env, {
			PATH: process.env.PATH + ':' + resolve(getProjectPath(), 'node_modules/.bin'),
		}),
		encoding: 'utf8',
		shell: '/bin/bash',
	});
	return ret.status;
}

export function spawnRun(docker_env: string,
                         args: string[] = [],
                         otherEnv: {[id: string]: string} = {},
                         script = 'start.sh') {
	const fullPath = resolve(getTempPath(), script);
	const ret = spawnSyncWrap(fullPath, args, {
		cwd: getProjectPath(),
		stdio: 'inherit',
		env: extend({}, process.env, {
			DOCKER_START_ARGS: docker_env,
		}, otherEnv),
		encoding: 'utf8',
		shell: '/bin/bash',
	});
	return ret.status;
}

function prevent_parent_process_exit() {
	console.error('\x1B[38;5;14m[micro-build]\x1B[0m[main] passing SIGINT to child process.');
	console.error('        press twice to force quit. (may cause unclean shell status)');
	process.removeListener('SIGINT', prevent_parent_process_exit);
}

function spawnSyncWrap(path: string, args: any[], options: any) {
	console.error('\x1B[38;5;14m[micro-build]\x1B[0m[spawn] %s "%s"', path, args.join('" "'));
	console.error('');
	
	process.on('SIGINT', prevent_parent_process_exit);
	
	process.stdin.pause();
	if (process.stdin['setRawMode']) {
		process.stdin['setRawMode'](false);
	}
	const ret = spawnSync(path, args, options);
	if (process.stdin['setRawMode']) {
		process.stdin['setRawMode'](true);
	}
	process.stdin.resume();
	
	if (ret.error) {
		console.error('\x1B[38;5;9m[micro-build]\x1B[0m[spawn failed] %s', ret.error.message);
		console.error('%s "%s"', path, args.join('" "'));
		console.error('options: %s', JSON.stringify(options, null, 4));
	}
	
	console.error('\x1B[38;5;14m[micro-build]\x1B[0m[return] %s return: %s', basename(path), ret.status);
	process.removeListener('SIGINT', prevent_parent_process_exit);
	
	return ret;
}
