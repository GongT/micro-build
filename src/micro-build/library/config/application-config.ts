import {writeFileSync} from "fs";
import {mkdirpSync} from "fs-extra";
import {dirname, resolve} from "path";
import {ignoreError, programSection, programSectionEnd} from "../../bin/error";
import {fileExists} from "../common/filesystem";
import {ScriptsRunner} from "../engine/script-run";

const APP_CONFIG_FILE = resolve(process.env.HOME, '.microbuildrc');
const APP_CONFIG_FILE_GLOBAL = '/etc/microbuild/config.sh';

export const AppConfig = {};

export async function loadApplicationConfigs() {
	programSection('load global microbuild rc file');
	if (fileExists(APP_CONFIG_FILE_GLOBAL)) {
		Object.assign(AppConfig, await load(APP_CONFIG_FILE_GLOBAL));
	} else {
		try {
			mkdirpSync(dirname(APP_CONFIG_FILE_GLOBAL));
			writeFileSync(APP_CONFIG_FILE_GLOBAL, '');
		} catch (e) {
			ignoreError(e);
		}
	}
	programSectionEnd();
	programSection('load user microbuild rc file');
	if (fileExists(APP_CONFIG_FILE)) {
		Object.assign(AppConfig, await load(APP_CONFIG_FILE));
	} else {
		try {
			writeFileSync(APP_CONFIG_FILE, '');
		} catch (e) {
			ignoreError(e);
		}
	}
	programSectionEnd();
	
	Object.freeze(AppConfig);
}

async function load(filePath: string): Promise<object> {
	const ret = {};
	const run = new ScriptsRunner('load-variables');
	const output = await run.collectOutput(filePath);
	output.trim().split('\n').forEach((line) => {
		const i = line.indexOf('=');
		const name = line.substr(0, i).toUpperCase();
		if (AppConfig.hasOwnProperty(name)) {
			ret[name] = line.substr(i + 1);
		}
	});
	return ret;
}
