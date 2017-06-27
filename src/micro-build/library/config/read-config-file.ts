import {hideGlobal} from "@gongt/ts-stl-library/pattern/hide-global";
import {createHash} from "crypto";
import {readFileSync, writeFileSync} from "fs";
import {dirname, resolve} from "path";
import {die} from "../common/cli-process";
import {fileExists, isANewerThanB} from "../common/filesystem";
import {TEMP_FOLDER_NAME} from "../common/paths";
import {runExternalCommand} from "../common/spawn";
import {ConfigFile} from "./config-file";

export function readConfigFile(config: ConfigFile, filePath: string) {
	const tempFile = resolve(dirname(filePath), TEMP_FOLDER_NAME, 'config-compile.js');
	if (!fileExists(tempFile) || isANewerThanB(filePath, tempFile)) {
		updateConfigFileFormat(filePath);
		runExternalCommand(config.path, ['tsc', filePath, '--lib', 'es7', '--outFile', tempFile]);
	}
	
	const un = hideGlobal('config', config);
	try {
		require(tempFile);
	} catch (e) {
		die(e);
	}
	un();
}

function md5(str: string) {
	return createHash('md5').update(str, 'utf8').digest('hex');
}
function updateConfigFileFormat(file: string) {
	let content = readFileSync(file, 'utf8');
	const sig = md5(content);
	
	// header line (global type ref)
	const typeRef = `///<reference types="@gongt/micro-build/config-file-ref"/>`;
	if (content.indexOf(typeRef) === -1) {
		content = `${typeRef}\n${content}`;
	}
	
	if (md5(content) === sig) {
		return;
	}
	
	writeFileSync(file, content, 'utf8');
}
