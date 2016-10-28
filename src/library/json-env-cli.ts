import {getProjectPath} from "./file-paths";
import {spawnSync} from "child_process";
import {resolve} from "path";
import {selection, input} from "./ask-user";

export function injectJsonEnv() {
	if (global['JsonEnv']) {
		return global['JsonEnv'];
	}
	if (process.env.JENV_FILE_NAME) {
		console.log('read json-env from file %s', process.env.JENV_FILE_NAME);
		require('json-env-data/global');
		return global['JsonEnv'];
	}
	
	// console.trace();
	// console.log();
	
	console.log('require json env, not configure.');
	
	const ret = spawnSync('jenv', ['--status', '--json'], {
		cwd: getProjectPath(),
		stdio: ['ignore', 'pipe', 'inherit'],
		encoding: 'utf8'
	});
	if (ret.status !== 0) {
		throw new Error(`can't check status of json-env config set.`);
	}
	
	let status;
	try {
		status = JSON.parse(ret.stdout);
	} catch (e) {
		throw new Error(`output of "jenv" not valid: ${e.message}: ${ret.stdout}`);
	}
	if (!status.set) {
		select_set(status.local);
	}
	
	if (!status.env) {
		select_env();
	}
	
	process.env.JENV_FILE_NAME = resolve(getProjectPath(), '.jsonenv', '_current_result.json');
	
	global['JsonEnv'] = update_cache();
	
	console.log('injectJsonEnv() successed...');
	return global['JsonEnv'];
}

function select_set(local) {
	let ret;
	ret = spawnSync('jenv', ['--list', 'set'], {
		cwd: getProjectPath(),
		stdio: ['ignore', 'pipe', 'inherit'],
		encoding: 'utf8'
	});
	if (ret.status !== 0) {
		throw new Error(`can't select json-env config set: list .`);
	}
	const selections = {};
	let defaultItem = false;
	ret.stdout.trim().split(/\n/g).filter(i => i).forEach((item: string, index) => {
		if (local === item) {
			defaultItem = index + 1;
		}
		selections[(1 + index).toString()] = item;
	});
	
	if (Object.keys(selections).length === 0) {
		pull_new_set();
	} else {
		selections['n'] = 'use a new url...';
		
		let selected;
		const sel = selection('please select a config set to build service', selections, defaultItem);
		if (sel === 'n') {
			selected = pull_new_set();
		} else {
			selected = selections[sel];
		}
		
		ret = spawnSync('jenv', ['--set', selected], {
			cwd: getProjectPath(),
			stdio: ['ignore', 'inherit', 'inherit'],
			encoding: 'utf8'
		});
	}
	if (ret.status !== 0) {
		throw new Error(`can't select json-env config set.`);
	}
}

let cache;
export function update_cache() {
	if (cache) {
		return cache;
	}
	console.log('update json-env cache.');
	const ret = spawnSync('jenv', ['--show'], {
		cwd: getProjectPath(),
		stdio: ['ignore', 'pipe', 'ignore'],
		encoding: 'utf8'
	});
	if (ret.status !== 0) {
		throw new Error(`failed to update json-env cache.`);
	}
	
	let rawJsonEnv;
	try {
		rawJsonEnv = JSON.parse(ret.stdout);
		cache = rawJsonEnv;
	} catch (e) {
		throw new Error(`output of "jenv" not valid: ${e.message}: ${ret.stdout}`);
	}
	
	return rawJsonEnv;
}

function select_env() {
	let ret;
	ret = spawnSync('jenv', ['--list', 'env'], {
		cwd: getProjectPath(),
		stdio: ['ignore', 'pipe', 'inherit'],
		encoding: 'utf8'
	});
	if (ret.status !== 0) {
		throw new Error(`can't select json-env config environment.`);
	}
	
	const selections = {};
	ret.stdout.trim().split(/\n/g).filter(i => i).forEach((item: string, index) => {
		selections[(1 + index).toString()] = item;
	});
	
	const sel = selection('please select an environment to build service', selections, false);
	
	ret = spawnSync('jenv', ['--env', selections[sel]], {
		cwd: getProjectPath(),
		stdio: ['ignore', 'inherit', 'inherit'],
		encoding: 'utf8'
	});
	if (ret.status !== 0) {
		throw new Error(`can't select json-env config environment.`);
	}
}

function pull_new_set() {
	const gitUrl = input('input config files git url').trim();
	
	if (!/^(ssh|https?):\/\//.test(gitUrl)) {
		throw new Error('please input valid git url.');
	}
	
	let ret;
	ret = spawnSync('jenv', ['--pull', '--global', gitUrl], {
		stdio: ['ignore', 'pipe', 'inherit'],
		encoding: 'utf8'
	});
	if (ret.status !== 0) {
		throw new Error(`can't pull json-env from "${gitUrl}".`);
	}
	
	process.exit(1);
}
