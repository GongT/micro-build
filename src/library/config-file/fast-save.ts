import {resolve} from "path";
import {chmodSync} from "fs";
import {ConfigJsonFile} from "./config-json-file";
import {getTempPath} from "../common/file-paths";
import {PlainTextFile} from "./plain-text-file";

export function saveJsonFile(file, content: any) {
	const path = resolve(getTempPath(), file);
	const cfg = new ConfigJsonFile(resolve(getTempPath(), path), true);
	cfg.replaceContent(content);
	cfg.write();
}

export function saveJsonFilePublic(file, content: any) {
	saveJsonFile('../' + file, content);
}

export function saveFile(file, content: string, mode: string = '') {
	const path = resolve(getTempPath(), file);
	const cfg = new PlainTextFile(resolve(getTempPath(), path), true);
	cfg.replaceContent(content);
	const written = cfg.write();
	if (written && mode) {
		chmodSync(path, mode);
	}
}

export function saveFilePublic(file, content: string, mode: string = '') {
	saveFile('../' + file, content, mode);
}
