import {resolve} from "path";
import {existsSync} from "fs";
import {TextFile} from "./text-file";

export const MicroBuildRoot = resolve(__dirname, '../..');
export const MicroFilesRoot = resolve(MicroBuildRoot, 'dist');

let projectPath;
export const tempDirName = '.micro-build';
let tempPath;
let configPath;

export function assertCurrentDirOk() {
	if (!existsSync(projectPath) || !existsSync(projectPackageJson())) {
		console.error('hey, there is not a package.json file. are you working with right folder?');
		return false;
	}
	return true;
}

export function projectPackageJson() {
	return resolve(projectPath, 'package.json');
}

export function updateCurrentDir(dir: string, ignore: boolean = false) {
	if (existsSync(resolve('/data/services', dir))) {
		dir = resolve('/data/services', dir);
	}
	console.error('chdir(%s)', dir);
	projectPath = resolve(dir);
	if (!ignore) {
		assertCurrentDirOk() || process.exit(1);
	}
	tempPath = resolve(projectPath, tempDirName);
	configPath = resolve(tempPath, 'config.ts');
}
export function getConfigPath(): string {
	if (!projectPath) {
		updateCurrentDir(process.cwd());
	}
	return configPath;
}
export function getTempPath(): string {
	if (!projectPath) {
		updateCurrentDir(process.cwd());
	}
	return tempPath;
}
export function getProjectPath(): string {
	if (!projectPath) {
		updateCurrentDir(process.cwd());
	}
	return projectPath;
}

export function templateFile(fileName) {
	return resolve(MicroBuildRoot, 'template', fileName);
}
export function projectFile(fileName) {
	return resolve(getProjectPath(), fileName);
}

export function templateFileObject(fn) {
	return new TextFile(templateFile(fn), false);
}

export function projectFileObject(fn) {
	return new TextFile(projectFile(fn), true);
}
