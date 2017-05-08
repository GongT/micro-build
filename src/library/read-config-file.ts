import {ConfigFile} from "../config-file";
import {dirname, resolve} from "path";
import {getPathConfigFile, TEMP_FOLDER_NAME} from "./paths";
import {fileExists, isANewerThanB} from "./common/filesystem";
import {runExternalCommand} from "./common/spawn";
import {die} from "../bin/bin";

export function readConfigFile(): ConfigFile {
	const filePath = getPathConfigFile();
	const tempFile = resolve(dirname(filePath), TEMP_FOLDER_NAME, 'config.js');
	if (!fileExists(tempFile) || isANewerThanB(filePath, tempFile)) {
		runExternalCommand('tsc', [filePath, '--lib', 'es7', '--outFile', tempFile]);
	}
	let cfg: ConfigFile;
	try {
		cfg = require(tempFile).default;
	} catch (e) {
		die(e);
	}
	
	if (cfg instanceof ConfigFile) {
		return cfg;
	}
	
	die(`Config file parse error:
no default export, or not instance of ConfigFile.
export is type: %s`, typeof cfg);
}
