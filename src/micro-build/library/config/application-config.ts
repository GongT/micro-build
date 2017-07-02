import {resolve} from "path";
import {ExitCode, ExitStatus} from "../../bin/command-switch";
import {fileExists} from "../common/filesystem";
import {PathResolver} from "../common/paths";
import {ConfigFile} from "./config-file";

const APP_CONFIG_FILE = resolve(process.env.HOME, '.microbuildrc');
const APP_CONFIG_FILE_GLOBAL = '/etc/microbuild';

export class ApplicationConfig {
	public readonly path: PathResolver;
	
	constructor(pr: PathResolver) {
		this.path = pr;
		if (fileExists(APP_CONFIG_FILE_GLOBAL)) {
			this.load(APP_CONFIG_FILE_GLOBAL);
		}
		if (fileExists(APP_CONFIG_FILE)) {
			this.load(APP_CONFIG_FILE);
		}
	}
	
	currentConfigFile(optional: boolean = false): ConfigFile {
		const conf = new ConfigFile(this.path);
		if (!optional && !conf.exists) {
			throw new ExitStatus(ExitCode.config_exists, '`' + conf.path + '` not a project root');
		}
		return conf;
	}
	
	private load(filePath: string) {
		// todo: file parser
	}
}
