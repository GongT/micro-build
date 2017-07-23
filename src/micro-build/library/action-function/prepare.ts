import {ConfigFile} from "../../library/config/config-file";
import {updateConfigFileImports} from "./prepare/config-file-import";
import {createTsConfig} from "./prepare/create-tsconfig";

export function prepareToRun(mb: ConfigFile) {
	createTsConfig(mb.path);
	
}

export function updateBuildFolder(mb: ConfigFile) {
	updateConfigFileImports(mb);
	
}
