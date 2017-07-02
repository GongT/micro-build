import {ApplicationConfig} from "../config/application-config";
import {updateConfigFileImports} from "./config-file-import";
import {createTsConfig} from "./create-tsconfig";

export function prepareToRun(mb: ApplicationConfig) {
	createTsConfig(mb.path);
	updateConfigFileImports(mb.path);
	
}
