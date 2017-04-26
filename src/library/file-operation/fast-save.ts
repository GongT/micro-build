import {chmodSync} from "fs";
import {ConfigJsonFile} from "./config-json-file";
import {PlainTextFile} from "./plain-text-file";

export function saveJsonFile(absPath: string, content: any) {
	const cfg = new ConfigJsonFile(absPath, true);
	cfg.replaceContent(content);
	cfg.write();
}

export function saveFile(absPath: string, content: string, mode: string = '') {
	const cfg = new PlainTextFile(absPath, true);
	cfg.replaceContent(content);
	const written = cfg.write();
	if (written && mode) {
		chmodSync(absPath, mode);
	}
}
