import {resolve} from "path";
import {NormalizedArguments} from "../commands/argument-parser/real-parse";

let projectRoot: string = process.cwd();
const ROOT: string = resolve(__dirname, '..');
export const CONFIG_FILE_NAME: string = 'build.config.ts';
export const CONFIG_PATH: string = 'build';
export const TEMP_FOLDER_NAME: string = '.micro-build';

export function switchProjectFromArguments(args: NormalizedArguments) {
	if (args.namedOptions.project && args.namedOptions.project !== '.') {
		const target = resolve(process.cwd(), args.namedOptions.project);
		switchProject(target);
	} else {
		switchProject(process.cwd());
	}
	
	
}

export function switchProject(path: string) {
	projectRoot = path;
}

export function getPathProject(resolveTo?: string) {
	return resolveTo? resolve(projectRoot, resolveTo) : projectRoot;
}

export function getPathMicrobuild(resolveTo?: string) {
	return resolveTo? resolve(ROOT, resolveTo) : ROOT;
}

export function getPathTemp(resolveTo?: string) {
	return resolveTo? resolve(projectRoot, TEMP_FOLDER_NAME, resolveTo) : resolve(projectRoot, TEMP_FOLDER_NAME, resolveTo);
}

export function getPathConfigFile() {
	return getPathProject(CONFIG_PATH + '/' + CONFIG_FILE_NAME);
}

export function getPathConfigPath() {
	return getPathProject(CONFIG_PATH);
}
