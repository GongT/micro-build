import {resolve, dirname} from "path";
import {writeFileSync, chmodSync, existsSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {ConfigJsonFile} from "./config-json-file";
import {getTempPath} from "../common/file-paths";

export function saveJsonFile(file, content: any) {
	const path = resolve(getTempPath(), file);
	const cfg = new ConfigJsonFile(resolve(getTempPath(), path), true);
	console.error('saving file %s...', path);
	cfg.replaceContent(content);
	cfg.write();
}

export function saveJsonFilePublic(file, content: any) {
	saveJsonFile('../' + file, content);
}

export function saveFile(file, content: string, mode: string = '') {
	const path = resolve(getTempPath(), file);
	console.error('saving file %s...', path);
	if (!existsSync(dirname(path))) {
		mkdirpSync(dirname(path))
	}
	writeFileSync(path, content, 'utf8');
	if (mode) {
		chmodSync(path, mode);
	}
}

export function saveFilePublic(file, content: string, mode: string = '') {
	saveFile('../' + file, content, mode);
}
