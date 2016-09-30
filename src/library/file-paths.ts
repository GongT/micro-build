import {resolve} from "path";
import {realpathSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {TextFile} from "./text-file";

export const MicroBuildRoot = resolve(__dirname, '../..');
export const MicroFilesRoot = resolve(MicroBuildRoot, 'dist');

let projectPath;
export const tempDirName = '.micro-build';
let tempPath;
let configPath;
updateCurrentDir(process.cwd());

export function updateCurrentDir(dir: string, create: boolean = false) {
	if (create) {
		try {
			projectPath = realpathSync(dir);
		} catch (e) {
			mkdirpSync(dir);
			projectPath = realpathSync(dir);
		}
	} else {
		projectPath = realpathSync(dir);
	}
	tempPath = resolve(projectPath, tempDirName);
	configPath = resolve(tempPath, 'config.ts');
}
export function getConfigPath(): string {
	return configPath;
}
export function getTempPath(): string {
	return tempPath;
}
export function getProjectPath(): string {
	return projectPath;
}

export function templateFile(fileName) {
	return resolve(MicroBuildRoot, 'template', fileName);
}
export function projectFile(fileName) {
	return resolve(projectPath, fileName);
}

export function templateFileObject(fn) {
	return new TextFile(templateFile(fn), false);
}

export function projectFileObject(fn) {
	return new TextFile(projectFile(fn), true);
}
