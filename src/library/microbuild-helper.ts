import {writeFileSync, readFileSync} from "fs";
import {resolve} from "path";
import {getProjectPath} from "./file-paths";
import {MicroBuildConfig} from "./microbuild-config";

export class MicroBuildHelper {
	constructor(private build: MicroBuildConfig) {
	}
	
	createConfig(content: string = '') {
		return new ConfigFileHelper(this.build, content);
	}
}
export class ConfigFileHelper {
	constructor(private build: MicroBuildConfig, private fileContent: string = '') {
		const port = build.toJSON().port;
		const baseDomain = '//' + build.toJSON().base;
		
		let isDebug = false;
		if (global.hasOwnProperty(JsonEnv)) {
			isDebug = JsonEnv.isDebug;
		}
		this.fileContent += `
export const CONFIG_BASE_DOMAIN = ${JSON.stringify(baseDomain)};
export const CONFIG_BASE_DOMAIN_DEBUG = ${JSON.stringify(baseDomain)};
export const IS_PACKAGE_DEBUG_MODE = ${isDebug? 'true' : 'false'};
`;
	}
	
	save(path: string) {
		const absPath = resolve(getProjectPath(), path);
		if (readFileSync(absPath, 'utf-8') !== this.fileContent) {
			writeFileSync(absPath, this.fileContent, 'utf-8');
		}
		this.build.registerIgnore(path);
	}
}
