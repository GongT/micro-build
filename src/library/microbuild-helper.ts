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
	private fileContent;
	
	constructor(private build: MicroBuildConfig,  content: string = '') {
		const port = build.toJSON().port;
		const baseDomain = '//' + build.toJSON().domain;
		
		let isDebug = false;
		if (global.hasOwnProperty(JsonEnv)) {
			isDebug = JsonEnv.isDebug;
		}
		this.fileContent = `/// <reference types="node"/>

${content}

export const CONFIG_BASE_DOMAIN = ${JSON.stringify(baseDomain)};
export const CONFIG_BASE_DOMAIN_DEBUG = ${JSON.stringify(baseDomain)};
let debug = ${isDebug? 'true' : 'false'};
if(typeof window === 'object'){
	if(window.hasOwnProperty('IS_DEBUG')){
		debug = window['IS_DEBUG'];
	} else if(global && global.process && global.process.env.NODE_ENV) {
		debug = global.process.env.NODE_ENV !== 'production';
	}
} else {
	if(global.hasOwnProperty('JsonEnv')){
		debug = global['JsonEnv'].isDebug;
	} else {
			debug = global.process.env.NODE_ENV !== 'production';
	}
}
export const IS_PACKAGE_DEBUG_MODE = debug;
export const AUTO_CONFIG_BASE_DOMAIN = debug ? CONFIG_BASE_DOMAIN : CONFIG_BASE_DOMAIN_DEBUG;
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
