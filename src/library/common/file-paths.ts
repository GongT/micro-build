import {resolve} from "path";
import {existsSync} from "fs";
import {moveSync} from "nodejs-fs-utils";
import {TextFile} from "../config-file/text-file";
import {getEnvironmentName} from "./runenv";

export const MicroBuildRoot = resolve(__dirname, '../../..');
export const MicroBuildTemplateRoot = resolve(MicroBuildRoot, 'template');

let projectPath;
export const TEMP_DIR_NAME = '.micro-build';
let configPath;

updateCurrentDir(process.cwd(), true);

export function assertCurrentDirOk() {
	if (!existsSync(projectPath) || !existsSync(projectPackageJson())) {
		throw new Error('hey, there is not a package.json file. are you working with right folder?');
	}
}

export function projectPackageJson() {
	return resolve(projectPath, 'package.json');
}

export function updateCurrentDir(dir: string, ignore: boolean = false) {
	if (existsSync(resolve('/data/services', dir, 'package.json'))) {
		dir = resolve('/data/services', dir);
	}
	console.error('chdir(%s)', dir);
	projectPath = resolve(dir);
	if (!ignore) {
		assertCurrentDirOk();
	}
	configPath = resolve(projectPath, 'build.config.ts');
	
	const oldConfigFile = resolve(projectPath, TEMP_DIR_NAME, getEnvironmentName(), 'config.ts');
	if (existsSync(oldConfigFile) && !existsSync(configPath)) {
		moveSync(oldConfigFile, configPath);
	}
}
export function getConfigPath(): string {
	return configPath;
}
export function getGeneratePath(rel: boolean = false): string {
	if (rel) {
		return resolve('/', TEMP_DIR_NAME).replace(/^\//, '');
	} else {
		return resolve(projectPath, TEMP_DIR_NAME);
	}
}
export function getTempPath(rel: boolean = false): string {
	if (rel) {
		return resolve('/', TEMP_DIR_NAME, getEnvironmentName()).replace(/^\//, '');
	} else {
		return resolve(projectPath, TEMP_DIR_NAME, getEnvironmentName());
	}
}
export function getProjectPath(): string {
	return projectPath;
}

export function templateFile(fileName: string) {
	return resolve(MicroBuildRoot, 'template', fileName);
}
export function projectFile(fileName: string) {
	return resolve(getProjectPath(), fileName);
}

export function templateFileObject(fn: string) {
	return new TextFile(templateFile(fn), false);
}

export function projectFileObject(fn: string) {
	return new TextFile(projectFile(fn), true);
}
