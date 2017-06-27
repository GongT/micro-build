import {resolve} from "path";
import {fileExists} from "../common/filesystem";

const APP_CONFIG_FILE = resolve(process.env.HOME, '.microbuildrc');
const APP_CONFIG_FILE_GLOBAL = '/etc/microbuild';

export class ApplicationConfig {
	constructor() {
		if (fileExists(APP_CONFIG_FILE_GLOBAL)) {
			this.load(APP_CONFIG_FILE_GLOBAL);
		}
		if (fileExists(APP_CONFIG_FILE)) {
			this.load(APP_CONFIG_FILE);
		}
	}
	
	private load(filePath: string) {
		// todo: file parser
	}
}
