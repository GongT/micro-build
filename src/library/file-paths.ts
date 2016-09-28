import {resolve} from "path";
import {projectPath} from "../microbuild";
import {TextFile} from "./text-file";
export const MicroBuildRoot = resolve(__dirname, '../..');
export const MicroFilesRoot = resolve(MicroBuildRoot, 'dist');

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
